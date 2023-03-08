import type { NextApiRequest, NextApiResponse } from 'next'
import { User } from '@/lib/models';
import { getDatabaseConn, SqlClient } from '@/lib/db'
import { getServerSession, Session } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { AppError, AppResponse, err, NewAppError, NewAppResponse } from '@/lib/utils/api';
import CreateUserForm, { CreateUserFormSchema } from '@/lib/forms/user';
import * as argon2 from '@node-rs/argon2';

type Get = User[];
type Post = User;

async function get(_req: NextApiRequest, db: SqlClient): Promise<User[]> {
    return await User.fetchAll(db);
}

async function post(req: NextApiRequest, session: Session, db: SqlClient): Promise<User> {
    // must be an admin to create a user
    if (!session.user.admin) {
        throw new Error('must be an admin to create a user');
    }

    const form: CreateUserForm = await CreateUserFormSchema.validate(req.body);
    const user = User.Create(form);

    // hash password
    const hashed = await argon2.hash(form.password, {
        memoryCost: 8192,
        timeCost: 10,
        outputLen: 32,
        parallelism: 1,
        algorithm: 2, // argon2.Algorithm.Argon2id, (cannot access ambient const enums w/ --isolatedModules)
        version: 1 // argon2.Version.V0x13, (cannot access ambient const enums w/ --isolatedModules)
    });

    try {
        await db.query('BEGIN');
        await user.save(db);
        await user.resetPassword(db, hashed);
        await db.query('COMMIT');
    } catch (error: any) {
        await db.query('ROLLBACK');
        throw error;
    }

    return user;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<AppResponse<Get> | AppResponse<Post> | AppError>
) {
    const session: Session | null = await getServerSession(req, res, authOptions);
    if (!session) {
        err(res, 401, "unauthorized");
        return;
    }

    let resp: AppResponse<Get> | AppResponse<Post> | AppError;
    const db = await getDatabaseConn();
    try {
        switch (req.method) {
            case 'GET':
                resp = NewAppResponse(200, await get(req, db));
                break;
            case 'POST':
                resp = NewAppResponse(201, await post(req, session, db));
                break;
            default:
                resp = NewAppError(405, "Method Not Allowed");
        }
    } catch (error: any) {
        console.error(error);
        resp = NewAppError(500, "Internal Server Error");
    } finally {
        db.release();
    }

    res.status(resp.code).json(resp);
}

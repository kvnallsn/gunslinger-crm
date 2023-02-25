import type { NextApiRequest, NextApiResponse } from 'next'
import { Contact, User } from '@/lib/models';
import { getDatabaseConn } from '@/lib/db'
import { PoolClient } from 'pg';
import { AppError, AppResponse, err, NewAppResponse } from '@/lib/utils/api';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<AppResponse<User> | AppError>
) {
    let db: PoolClient | undefined = undefined;
    let session: Session | null = await getServerSession(req, res, authOptions);

    if (!session) {
        err(res, 401, "unauthorized");
        return;
    }

    try {
        db = await getDatabaseConn();
        const user = await User.fetchUserByUsername(db, session.user.username);
        db.release();

        res.status(200).json(NewAppResponse(200, user));
    } catch (error: any) {
        console.error(error);
        db?.release()

        err(res, 500, "internal server error");
    }
}

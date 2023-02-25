import { getDatabaseConn, SqlClient } from "@/lib/db";
import { CreateGroupFormSchema } from "@/lib/forms";
import Group from "@/lib/models/groups";
import { AppError, AppResponse, err, NewAppError, NewAppResponse } from "@/lib/utils/api";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

type Get = Group[];
type Post = Group;

async function get(req: NextApiRequest, db: SqlClient): Promise<Get> {
    return await Group.fetchAll(db);
}

async function post(req: NextApiRequest, tx: SqlClient): Promise<Post> {
    const form = await CreateGroupFormSchema.validate(req.body);
    const group = new Group({ name: form.name });

    try {
        await tx.query('BEGIN');
        await group.save(tx);
        for (const member of form.users ?? []) {
            await group.addMember(tx, member.id, member.username, member.level);
        }
        await tx.query('COMMIT');
    } catch (error: any) {
        console.error(error);
        await tx.query('ROLLBACK');
    }
    return group;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<AppResponse<Get> | AppResponse<Post> | AppError>
) {
    const session: Session | null = await getServerSession(req, res, authOptions);
    if (!session || !session.user.admin) {
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
                resp = NewAppResponse(201, await post(req, db));
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

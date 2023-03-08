import type { NextApiRequest, NextApiResponse } from 'next'
import { getDatabaseConn, SqlClient } from '@/lib/db'
import { AppError, AppResponse, err, NewAppResponse } from '@/lib/utils/api';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { Topic } from '@/lib/models/topic';

type Data = AppResponse<Topic[]>;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | AppError>
) {
    let session: Session | null = await getServerSession(req, res, authOptions);
    if (!session) {
        err(res, 401, "Unauthorized");
        return
    }

    let db: SqlClient | undefined = undefined;
    let data: Topic[] = [];
    try {
        db = await getDatabaseConn();
        data = await Topic.fetchAll(db);
    } catch (error: any) {
        console.error(error);
        return err(res, 500, 'Internal Server Error');
    } finally {
        db?.release()
    }

    res.status(200).json(NewAppResponse(200, data));
}

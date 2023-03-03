import type { NextApiRequest, NextApiResponse } from 'next'
import { Engagement } from '@/lib/models';
import { getDatabaseConn, SqlClient } from '@/lib/db'
import { AppError, AppResponse, err, NewAppResponse } from '@/lib/utils/api';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

type Data = AppResponse<Engagement[] | Engagement>;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | AppError>
) {
    let session: Session | null = await getServerSession(req, res, authOptions);
    if (!session) {
        err(res, 401, "Unauthorized");
        return
    }

    const { id } = req.query;

    let db: SqlClient | undefined = undefined;
    let data: Engagement[] | Engagement = [];
    try {
        db = await getDatabaseConn();
        if (!id) {
            data = await Engagement.fetchAll(db, session.user.id);
        } else {
            data = await Engagement.fetch(db, session.user.id, Array.isArray(id) ? id[0] : id);
        }
    } catch (error: any) {
        console.error(error);
        await db?.query('ROLLBACK');

        return err(res, 500, 'Internal Server Error');
    } finally {
        db?.release()
    }

    res.status(200).json(NewAppResponse(200, data));
}

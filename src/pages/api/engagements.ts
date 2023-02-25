import type { NextApiRequest, NextApiResponse } from 'next'
import { Engagement } from '@/lib/models';
import { getDatabaseConn, SqlClient } from '@/lib/db'
import { AppError, err } from '@/lib/utils/api';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

type Data = Engagement[];

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
    let data: Engagement[] = [];
    try {
        db = await getDatabaseConn();
        data = await Engagement.fetchAll(db, session.user.id);
    } catch (error: any) {
        console.error(error);
        await db?.query('ROLLBACK');

        return err(res, 500, 'Internal Server Error');
    } finally {
        db?.release()
    }

    res.status(200).json(data);
}

import type { NextApiRequest, NextApiResponse } from 'next'
import { Contact } from '@/lib/models';
import { getDatabaseConn } from '@/lib/db'
import { PoolClient } from 'pg';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

type Data = Contact[];

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    let db: PoolClient | undefined = undefined;
    let contacts: Contact[] = [];
    try {
        const session: Session | null = await getServerSession(req, res, authOptions);
        if (!session) {
            throw new Error('authorized');
        }

        db = await getDatabaseConn();
        contacts = await Contact.fetchAll(db, session.user.id);
    } catch (error: any) {
        console.error(error);
        await db?.query('ROLLBACK');
    } finally {
        db?.release()
    }

    res.status(200).json(contacts);
}

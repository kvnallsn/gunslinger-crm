import type { NextApiRequest, NextApiResponse } from 'next'
import { Contact } from '@/lib/models';
import { dbConnect } from '@/lib/db'
import { PoolClient } from 'pg';

type Data = Contact[];

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    let db: PoolClient | undefined = undefined;
    let contacts: Contact[] = [];
    try {
        db = await dbConnect();

        contacts = await Contact.fetchAll(db);
    } catch (error: any) {
        console.error(error);
        await db?.query('ROLLBACK');
    } finally {
        db?.release()
    }

    res.status(200).json(contacts);
}

import type { NextApiRequest, NextApiResponse } from 'next'
import { Contact } from '@/lib/models';
import useDatabase from '@/lib/db'
import { PoolClient } from 'pg';

type Data = {
    contacts: Contact[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    let db: PoolClient | undefined = undefined;
    let contacts: Contact[] = [];
    try {
        db = await useDatabase();

        contacts = await Contact.fetchAll(db);
    } catch (error: any) {
        console.log('error');
        await db?.query('ROLLBACK');
    } finally {
        db?.release()
    }

    res.status(200).json({ contacts: contacts })
}

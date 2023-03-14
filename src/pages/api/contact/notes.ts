import { getDatabaseConn } from '@/lib/db';
import { ContactNoteFormSchema } from '@/lib/forms/contact-note';
import { Contact } from '@/lib/models';
import { ContactNote } from '@/lib/models/contact';
import { AppError, AppResponse, err, NewAppError, NewAppResponse } from "@/lib/utils/api";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

type Data = AppResponse<ContactNote[]>;

function extract(req: NextApiRequest, field: string): string {
    const s = req.query[field];
    if (!s) {
        throw new Error(`missing parameter: ${field}`);
    }

    return Array.isArray(s) ? s[0] : s;
}

async function loadSession(req: NextApiRequest, res: NextApiResponse): Promise<Session> {
    const session: Session | null = await getServerSession(req, res, authOptions);
    if (!session) {
        throw new Error('failed to load session');
    }

    return session;
}

async function handlePost(req: NextApiRequest) {
    const form = await ContactNoteFormSchema.validate(req.body);
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | AppError>
) {
    const id = extract(req, 'id');
    const session = await loadSession(req, res);
    const db = await getDatabaseConn();

    let response: Data | AppError;
    switch (req.method) {
        case 'GET':
            const notes = await Contact.fetchNotes(db, session.user.id, id);
            response = NewAppResponse(200, notes);
            break;
        case 'POST':
            const form = await ContactNoteFormSchema.validate(req.body);
            await db.query('BEGIN');
            try {
                const notes = await Contact.createNote(db, session.user.id, id, form.text, form.groups);
                await db.query('COMMIT');
                response = NewAppResponse(200, notes);
            } catch (error: any) {
                await db.query('ROLLBACK');
                response = NewAppError(500, 'Internal Server Error');
            }
            break;
        default:
            response = NewAppError(500, 'Internal Server Error');
            break;
    }

    db.release();

    return res.status(response.code).json(response);
}
import { NextApiRequest } from "next";
import { NextApiResponse } from "next";
import { AppError, checkPost, err } from "@/lib/utils/api";
import EngagementForm, { EngagementFormSchema } from "@/lib/forms/engagement";
import { runDatabaseTx, SqlClient } from "@/lib/db";
import { Contact, Engagement } from '@/lib/models';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import User from "@/lib/models/user";
import { Topic } from '@/lib/models/topic';

type Data = {
    id: string;
}

async function handleForm(tx: SqlClient, email: string, form: EngagementForm): Promise<Engagement> {
    // get user id
    const user = await User.fetchUserByEmail(tx, email);

    // validate contacts
    const contacts = await Contact.fetchMany(tx, user.id, form.contacts);
    const userContact = await Contact.fetchByUser(tx, user);

    // validate topics
    const topics = await Topic.fetchMany(tx, form.topics);

    // create engagement
    const e = new Engagement({
        user: user,
        method: form.method,
        title: form.title,
        date: form.date,
        contacts: [...contacts, userContact],
        topics: topics,
    });

    await e.save(tx);

    for (var note of (form.notes ?? [])) {
        await e.addNote(tx, { text: note.text, created_by: user, public: note.public, groups: note.groups ?? [] });
    }

    return e;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | AppError>
) {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        return err(res, 401, 'Unauthorized');
    }

    const e = checkPost(req);
    if (e) {
        return err(res, e.code, e.msg);
    }

    try {
        const form: EngagementForm = await EngagementFormSchema.validate(req.body);
        const e = await runDatabaseTx(async db => await handleForm(db, session.user.email, form));

        res.status(201).json({ id: e.id });
    } catch (error: any) {
        console.error(error);
        err(res, 500, 'Internal Server Error');
    }
}
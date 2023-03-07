import { getDatabaseConn } from '@/lib/db';
import { Engagement } from '@/lib/models';
import { Topic } from '@/lib/models/engagement';
import { AppError, AppResponse, err, NewAppResponse } from "@/lib/utils/api";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

type Data = AppResponse<Topic[]>;

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

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | AppError>
) {
    const id = extract(req, 'id');
    const session = await loadSession(req, res);
    const db = await getDatabaseConn();

    const topics = await Engagement.fetchTopics(db, id);
    db.release();

    return res.status(200).json(NewAppResponse(200, topics));
}
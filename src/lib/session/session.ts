import { boolean, date, InferType, object, string } from 'yup';
import User from '@/lib/models/user';
import { createSessionClient } from '../db';
import { v4 as uuidv4 } from 'uuid';
import { NextApiResponse } from 'next';
import * as cookie from 'cookie';
import { NextRequest } from 'next/server';

const COOKIE_NAME: string = 'gunslinger-session';

const SessionSchema = object().shape({
    id: string()
        .required()
        .uuid(),

    userId: string()
        .required()
        .uuid(),
});

interface ISession extends InferType<typeof SessionSchema> { }

class Session {
    id: string;
    userId: string;

    private constructor(s: ISession) {
        this.id = s.id;
        this.userId = s.userId;
    }

    static create(user: User): Session {
        return new Session({ id: uuidv4(), userId: user.id });
    }

    static async load(req: NextRequest): Promise<Session | undefined> {
        const c = req.cookies.get(COOKIE_NAME);
        if (!c) {
            return undefined;
        }

        const client = await createSessionClient();
        const json = await client.get(c.value);
        if (!json) {
            return undefined;
        }

        const s = await SessionSchema.validate(json);
        return new Session(s);
    }

    async save() {
        const client = await createSessionClient();
        await client.set(this.id, JSON.stringify(this))
        await client.disconnect();
    }

    setCookie(res: NextApiResponse) {
        res.setHeader('Set-Cookie', cookie.serialize(COOKIE_NAME, String(this.id), {
            path: '/',
            httpOnly: true,
            sameSite: 'lax'
        }));
    }

    clearCookie(res: NextApiResponse) {
        res.setHeader('Set-Cookie', cookie.serialize(COOKIE_NAME, '', {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 0
        }));
    }
}

export default Session;
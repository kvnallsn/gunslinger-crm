import { boolean, date, InferType, object, string } from 'yup';
import User from '@/lib/models/user';
import { v4 as uuidv4 } from 'uuid';
import { NextApiResponse } from 'next';
import * as cookie from 'cookie';
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';

const COOKIE_NAME: string = 'gunslinger-session';
const JWT_SECRET_KEY: string | undefined = process.env.JWT_SECRET_KEY;

function getJwtSecretKey(): Uint8Array {
    if (!JWT_SECRET_KEY || JWT_SECRET_KEY.length === 0) {
        throw new Error('JWT_SECRET_KEY environment variable must be set.')
    }

    return new TextEncoder().encode(JWT_SECRET_KEY);
}

function makeCookie(value: string, maxAge: number): string {
    return cookie.serialize(COOKIE_NAME, value, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge,
    });
}

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

    static async validate(req: NextRequest) {
        const token = req.cookies.get(COOKIE_NAME)?.value;
        if (!token) throw new Error('Missing user token');

        try {
            const verified = await jwtVerify(token, getJwtSecretKey());
            return verified.payload;
        } catch (err: any) {
            console.error(err);
            throw new Error('Your token has expired.');
        }
    }

    static clear(res: NextApiResponse) {
        res.setHeader('Set-Cookie', makeCookie('', 0));
    }

    async save(res: NextApiResponse) {
        const token = await new SignJWT({
            'user': this.userId,
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setJti(this.id)
            .setIssuedAt()
            .setExpirationTime('2h')
            .sign(getJwtSecretKey());

        // max-age is 2 hours in seconds
        res.setHeader('Set-Cookie', makeCookie(token, 60 * 60 * 2));
    }

}

export default Session;
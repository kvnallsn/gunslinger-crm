import type { NextApiRequest, NextApiResponse } from 'next'
import { err, checkPost, AppError } from '@/lib/utils/api';
import { LoginForm, LoginFormSchema } from '@/lib/forms';
import { dbConnect } from '@/lib/db';
import User from '@/lib/models/user';
import * as argon2 from '@node-rs/argon2';
import Session from '@/lib/session/session';

type Data = {}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | AppError>
) {
    const e = checkPost(req);
    if (e) {
        err(res, e.code, e.msg);
        return;
    }

    const form: LoginForm = await LoginFormSchema.validate(req.body);

    // fetch user from database
    const db = await dbConnect();
    const user = await User.fetchUserByEmail(db, form.email);
    const hashed = await user.fetchPassword(db);

    // validate password
    if (await argon2.verify(hashed, form.password)) {
        // TODO create session
        let session = Session.create(user);
        await session.save(res);

        res.status(200).json({});
    } else {
        err(res, 401, 'Unauthorized');
    }

    // update db on last login

    db.release();
}
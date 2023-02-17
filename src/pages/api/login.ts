// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { LoginForm, LoginFormSchema } from '@/lib/forms';
import { AppError, checkPost, err } from '@/lib/utils/api'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | AppError>
) {
    const e = checkPost(req);
    if (e) {
        err(res, e.code, e.msg);
        return;
    }

    try {
        const form: LoginForm = await LoginFormSchema.validate(req.body);
        console.log(form);

        res.status(200).json({ name: 'John Doe' })
    } catch (error: any) {
        console.error(error);
        err(res, 400, 'Bad Request');
    }
}

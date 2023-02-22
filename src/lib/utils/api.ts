import type { NextApiRequest, NextApiResponse } from 'next'

type AppResponse<T> = {
    code: number;
    data: T,
}

type AppError = {
    code: number;
    msg: string;
}

function NewAppResponse<T>(code: number, data: T): AppResponse<T> {
    return { code, data };
}

function NewAppError(code: number, msg: string): AppError {
    return { code, msg };
}

function err(res: NextApiResponse<AppError>, code: number, msg: string) {
    res.status(code).json({ code, msg })
}

function checkPost(req: NextApiRequest): AppError | undefined {
    if (req.method !== "POST") {
        return { code: 405, msg: 'Method not allowed' };
    }

    if (req.body === null || req.body === undefined) {
        return { code: 400, msg: 'Bad Request' };
    }

    return undefined;
}

export { type AppError, type AppResponse, checkPost, err, NewAppError, NewAppResponse };
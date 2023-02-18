import Session from "@/lib/session/session";
import { AppError, checkPost, err } from "@/lib/utils/api";
import { NextApiRequest, NextApiResponse } from "next";

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

    Session.clear(res);
    res.status(200).json({});
}
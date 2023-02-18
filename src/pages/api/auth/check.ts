import Session from "@/lib/session/session";
import { AppError, checkPost, err } from "@/lib/utils/api";
import { NextApiRequest, NextApiResponse } from "next";

type Data = {}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | AppError>
) {
    res.status(200).json({});
}
import { Request, Response, NextFunction } from "express";
import { RequestWithUser, errorHandler } from "../utils/api";
import { decoupleAccessToken } from "../utils/crypto";
import md5 from "md5";
import { client } from "../utils/supabase";

const users = client.schema("public").from("users");

export const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const userToken = req.headers['x-melon-token'] as string;
    const userEmail = req.headers['x-melon-email'] as string;

    if (!userToken || !userEmail) return errorHandler(res, "Unauthorised", 401);

    const data = decoupleAccessToken(userToken, md5(userEmail))

    console.log(data)

    if (Date.now() > Number(data.expiresIn)) return errorHandler(res, "Token expired", 403)

    const user = await users.select("*").eq("id", Number(data.userId))

    if (user.data == null) return errorHandler(res, "Unauthorised", 401);

    req.user = user.data[0];

    next();
}
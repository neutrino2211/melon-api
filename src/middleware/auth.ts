import { Request, Response, NextFunction } from "express";
import { RequestWithUser, errorHandler } from "../utils/api";
import { decoupleAccessToken } from "../utils/crypto";
import md5 from "md5";
import { userRepository } from "../utils/data-source";

export const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const userToken = req.headers['x-melon-token'] as string;
    const userEmail = req.headers['x-melon-email'] as string;

    console.log(userEmail, userToken)

    if (!userToken || !userEmail) return errorHandler(res, "Unauthorised", 401);

    const data = decoupleAccessToken(userToken, md5(userEmail))

    console.log("D:", data)

    if (Date.now() > Number(data.expiresIn)) return errorHandler(res, "Token expired", 403)

    const user = await userRepository.findOne({where: {id: Number(data.userId)}})

    if (user == null) return errorHandler(res, "Unauthorised", 401);

    req.user = user;

    next();
}
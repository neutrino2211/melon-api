import { Request, Response } from "express";
import { RequestWithUser, errorHandler, successHandler } from "../../utils/api";
import md5 from "md5";
import { generateAccessToken } from "../../utils/crypto";
import { userRepository } from "../../utils/data-source";

export async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    console.log({email, password})

    const userRes = await userRepository.findOne({where: {email: email}})

    console.log("L:", userRes)

    if (userRes == null) return errorHandler(res, "Invalid email or password", 401);

    if (userRes.password !== md5(password)) return errorHandler(res, "Invalid email or password", 401);

    return successHandler(res, "Logged in successfully", {
        user: userRes,
        token: generateAccessToken(userRes.id.toString(), 1000 * 60 * 30, md5(userRes.email!!))
    })
}
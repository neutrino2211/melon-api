import { Request, Response } from "express";
import { client } from "../../utils/supabase";
import { errorHandler, successHandler } from "../../utils/api";
import md5 from "md5";
import { generateAccessToken } from "../../utils/crypto";

const users = client.schema("public").from("users");

export async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    console.log({email, password})

    const userRes = await users.select("*").eq("email", email);

    console.log("L:", userRes)

    if (userRes.count == 0 || userRes.data?.length == 0) return errorHandler(res, "Invalid email or password", 401);

    const user = userRes.data!![0]

    if (user.password !== md5(password)) return errorHandler(res, "Invalid email or password", 401);

    return successHandler(res, "Logged in successfully", {
        user,
        token: generateAccessToken(user.id.toString(), 1000 * 60 * 30, md5(user.email!!))
    })
}
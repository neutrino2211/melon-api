import { Request, Response } from "express";
import { client } from "../../utils/supabase";
import { RequestWithUser, errorHandler, successHandler } from "../../utils/api";
import md5 from "md5";
import { generateAccessToken } from "../../utils/crypto";

const users = client.schema("public").from("users");

export async function signUp(req: Request, res: Response) {
    const { data, error } = await client.auth.signUp({
        email: req.body.email,
        password: req.body.password
    })

    if (error) {
        return errorHandler(res, "Error signing up: " + error.message, 400)
    }

    const r = await users.insert({
        email: req.body.email,
        password: md5(req.body.password),
    })

    if (!!r.error) {
        return errorHandler(res, r.error.message, 403)
    }

    return successHandler(res, "Signed up successfully", data)
}

export async function confirmSignup(req: Request, res: Response) {
    const { token, email } = req.body;


    const { data: {user}, error } = await client.auth.verifyOtp({
        token: token,
        type: 'signup',
        email
    });

    if (error) {
        return errorHandler(res, "Error signing up: " + error.message, 400)
    }

    if (!user) {
        return errorHandler(res, "Error verifying token", 400)
    }

    const newUser = await users.update({
        authorization_code: token,
        verification_pending: false,
    }).eq("email", email).select();

    console.log(newUser, user, email)

    return successHandler(res, "Signed up successfully", {
        user: newUser.data!![0],
        token: generateAccessToken(newUser.data!![0].id.toString(), 1000 * 60 * 30, md5(email))
    });
}

export async function setPersonalDetails(req: RequestWithUser, res: Response) {
    const { name, dateOfBirth } = req.body;

    const user = await users.update({
        name,
        date_of_birth: dateOfBirth,
    }).eq("email", req.user.email!!).select();

    return successHandler(res, "user updated successfully", {
        user: {...user, name, date_of_birth: dateOfBirth}
    });
}

export async function setPin(req: RequestWithUser, res: Response) {
    const { pin } = req.body;

    const {data} = await users.update({
        pin
    }).eq("email", req.user.email!!).select();

    return successHandler(res, "user updated successfully", {
        user: data!![0]
    });
}
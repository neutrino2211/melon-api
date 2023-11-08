import { Request, Response } from "express";
import { RequestWithUser, errorHandler, genToken, successHandler } from "../../utils/api";
import md5 from "md5";
import { generateAccessToken } from "../../utils/crypto";
import { userRepository } from "../../utils/data-source";
import { User } from "../../models/User";

export async function signUp(req: Request, res: Response) {
    const r = await userRepository.findOne({where: {email: req.body.email}})
    
    if (!!r) {
        return errorHandler(res, "user with email already exists", 403)
    }

    const token = genToken()
    let user = new User()

    user.email = req.body.email,
    user.password = md5(req.body.password),
    user.authorisationCode = token

    await userRepository.insert(user);

    console.log(token)

    return successHandler(res, "Signed up successfully", {user})
}

export async function confirmSignup(req: Request, res: Response) {
    const { token, email } = req.body;

    const r = await userRepository.findOne({where: {authorisationCode: token, email}});

    if (r == null) {
        return errorHandler(res, "Invalid token", 400)
    }

    const newUser = await userRepository.update({authorisationCode: token}, {verificationPending: false})
    console.log(newUser, email)

    return successHandler(res, "Signed up successfully", {
        user: Object.assign(r, {verificationPending: false}),
        token: generateAccessToken(r.id.toString(), 1000 * 60 * 30, md5(email))
    });
}

export async function setPersonalDetails(req: RequestWithUser, res: Response) {
    const { name, dateOfBirth } = req.body;

    await userRepository.update({email: req.user.email}, {
        name,
        dateOfBirth
    })

    return successHandler(res, "user updated successfully", {
        user: {...req.user, name, date_of_birth: dateOfBirth}
    });
}

export async function setPin(req: RequestWithUser, res: Response) {
    const { pin } = req.body;

    await userRepository.update({email: req.user.email}, {
        pin
    })
    
    return successHandler(res, "user updated successfully", {
        user: req.user
    });
}
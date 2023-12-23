import { Response } from "express";
import { RequestWithUser, assertError, errorHandler, successHandler } from "../../utils/api";
import { userRepository } from "../../utils/data-source";

export async function getLoggedInUser(req: RequestWithUser, res: Response) {
  return successHandler(res, "Fetched logged in user", req.user);
}

export async function setUserPhoto(req: RequestWithUser, res: Response) {
  try {
    const { photo } = req.body;

    if (assertError(res, !photo)) return;

    await userRepository.update({id: req.user.id}, {photo})
    req.user.photo = photo;

    return successHandler(res, "User photo updated", req.user);
  } catch (e: any) {
    console.error(e)
    return errorHandler(res, e.message || "Unable to perform action, please try again")
  }
}
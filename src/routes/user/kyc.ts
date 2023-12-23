import { Response } from "express";
import { RequestWithUser, assertError, errorHandler, successHandler } from "../../utils/api";
import * as blochq from "../../utils/blochq"

const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export async function upgradeKycToTierOne(req: RequestWithUser, res: Response) {
  try {
    const {pob, country, address, gender} = req.body;

    if (assertError(res, !pob || !country || !address || !gender)) return;

    const upgrade = await blochq.upgradeKycToTierOne(formatDate(req.user.dateOfBirth), req.user.photo, pob, country, gender, address)

    if (upgrade.isErr()) {
      console.log(await upgrade.error())
      return errorHandler(res, "Unable to upgrade KYC level 1");
    }

    return successHandler(res, "Upgraded to kyc level 1", await upgrade.unwrap())  
  
  } catch(e: any) {
    console.error(e)
    errorHandler(res, e.message || "Unable to perform action, please try again")
  }
}
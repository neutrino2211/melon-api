import { Response } from "express";
import { RequestWithUser, errorHandler, successHandler } from "../../utils/api";
import { userRepository, walletRepository } from "../../utils/data-source";
import { AccountProviders, Wallet } from "../../models/Wallet";
import * as blochq from "../../utils/blochq";
import { Maybe } from "../../utils/types";

export async function getBalance(req: RequestWithUser, res: Response) {

  let wallet = await walletRepository.findOne({where: {user: req.user.id}})

  if (wallet == null) {
    wallet = new Wallet()
    wallet.balance = 0;
    wallet.user = req.user.id;

    await walletRepository.insert(wallet)
  }

  try {
    if (wallet.accountId != "") {
      const blocWallet = await (await blochq.getCustomerWallet(wallet.accountId)).unwrap()
      wallet.balance = (blocWallet.data.balance / 100)
    }
  } catch (e: any) {
    console.log(e)
  }

  return successHandler(res, "got wallet balance", wallet)
}

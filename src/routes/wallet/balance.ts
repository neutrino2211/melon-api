import { Response } from "express";
import { RequestWithUser, successHandler } from "../../utils/api";
import { walletRepository } from "../../utils/data-source";
import { Wallet } from "../../models/Wallet";

export async function getBalance(req: RequestWithUser, res: Response) {

  let wallet = await walletRepository.findOne({where: {user: req.user.id}})

  if (wallet == null) {
    wallet = new Wallet()
    wallet.balance = 0;
    wallet.user = req.user.id;

    await walletRepository.insert(wallet)
  }

  return successHandler(res, "got wallet balance", wallet)
}
import { Response } from "express";
import { RequestWithUser, errorHandler, successHandler } from "../../utils/api";
import { userRepository, walletRepository } from "../../utils/data-source";
import { AccountProviders, Wallet } from "../../models/Wallet";
import { Maybe } from "../../utils/types";
import * as blochq from "../../utils/blochq"

export async function getAccountDetails(req: RequestWithUser, res: Response) {

  let wallet = await walletRepository.findOne({where: {user: req.user.id}})

  if (wallet == null) {
    return errorHandler(res, "You don't have a wallet yet", 404)
  }

  if (wallet.accountId == null || wallet.accountId == "") {
    return errorHandler(res, "You have no bank account yet", 404)
  }

  const walletAccount = await (await blochq.getCustomerWallet(wallet.accountId)).unwrap();

  successHandler(res, "Wallet bank account fetched", walletAccount.data);
}

export async function createWallet(req: RequestWithUser, res: Response) {
  try {
    let wallet = await walletRepository.findOne({where: {user: req.user.id}})

    if (wallet == null) {
      return errorHandler(res, "You don't have a wallet yet", 404)
    }

    if (wallet.accountId != "") {
      const details = await (await blochq.getCustomerWallet(wallet.accountId)).unwrap()

      return successHandler(res, "Wallet already exists", {wallet: details.data})
    }

    const user = new Maybe(await userRepository.findOne({where: {id: wallet.user}})).unwrap();

    const customerAccount = await (await blochq.createCustomer(user)).unwrap()

    const customerWallet = await (await blochq.createCustomerWallet(user, customerAccount.data.id)).unwrap();

    wallet.accountId = customerWallet.data.id;
    wallet.accountType = AccountProviders.blochq;

    await walletRepository.save(wallet);

    return successHandler(res, "Wallet created successfully", {wallet: customerWallet.data})
  } catch (e: any) {
    console.error(e)
    return errorHandler(res, e)
  }
}
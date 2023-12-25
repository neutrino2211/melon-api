import { Request, Response } from "express";
import { RequestWithUser, UNHANDLED_ERROR, errorHandler, successHandler } from "../../utils/api";
import { userRepository, walletRepository } from "../../utils/data-source";
import { AccountProviders, Wallet } from "../../models/Wallet";
import { Maybe } from "../../utils/types";
import * as blochq from "../../utils/blochq"
import { ACCOUNT_DETAILS, FEES, getBanks } from "../../utils/blochq/util";
import { randomString } from "../../utils/crypto";
import { AccountCreated, BlocResponse } from "../../utils/blochq/types";

export async function getAccountDetails(req: RequestWithUser, res: Response) {

  let wallet = await walletRepository.findOne({where: {user: req.user.id}})

  if (wallet == null) {
    return errorHandler(res, "You don't have a wallet yet", 404)
  }

  if (wallet.accountId == null || wallet.accountId == "") {
    return errorHandler(res, "You have no bank account yet", 404)
  }

  const walletAccount = await (await blochq.getCustomerAccount(wallet.accountId)).unwrap();

  if (wallet.accountName == "") wallet.accountName = walletAccount.data.name;
  if (wallet.accountNumber == "") wallet.accountNumber = walletAccount.data.account_number;
  if (wallet.bankName == "") wallet.bankName = walletAccount.data.bank_name;

  await walletRepository.update({user: req.user.id}, wallet);

  console.log(walletAccount.data)

  successHandler(res, "Wallet bank account fetched", walletAccount.data);
}

export async function createWallet(req: RequestWithUser, res: Response) {
  try {
    let wallet = await walletRepository.findOne({where: {user: req.user.id}})

    if (wallet == null) {
      return errorHandler(res, "You don't have a wallet yet", 404)
    }

    if (wallet.accountId != "") {
      const details = await (await blochq.getCustomerAccount(wallet.accountId)).unwrap()

      return successHandler(res, "Wallet already exists", {wallet: details.data})
    }

    const user = new Maybe(await userRepository.findOne({where: {id: wallet.user}})).unwrap();

    let customerAccount: BlocResponse<AccountCreated> | undefined = undefined;
    const customerAccountRes = await blochq.createCustomer(user)

    if (customerAccountRes.isOk()) {
      customerAccount = await customerAccountRes.unwrap();
    } else {
      customerAccount = await (await blochq.getCustomerAccount(wallet.accountId)).unwrap() as any as BlocResponse<AccountCreated>
    }

    const customerFixedAccount = await (await blochq.createFixedAccount(user, customerAccount!!.data.id)).unwrap();

    console.log(customerFixedAccount);

    wallet.accountId = customerFixedAccount.data.id;
    wallet.accountType = AccountProviders.blochq;

    await walletRepository.save(wallet);

    return successHandler(res, "Wallet created successfully", {wallet: customerFixedAccount.data})
  } catch (e: any) {
    console.error(e)
    return errorHandler(res, e.message || "Unable to perform action, please try again")
  }
}

export async function getTransactions(req: RequestWithUser, res: Response) {
  try {
    let wallet = await walletRepository.findOne({where: {user: req.user.id}})

    if (wallet == null) {
      return errorHandler(res, "You don't have a wallet yet", 404)
    }

    console.log(wallet)
    const txs = await (await blochq.getAccountTransactions(wallet.accountId)).unwrap();

    console.log(txs)

    const sortedTxs = txs.data.sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());

    successHandler(res, "fetched all transactions successfully", sortedTxs)
  } catch(e: any) {
    console.error(e)
    errorHandler(res, UNHANDLED_ERROR(e))
  }
}

export async function deleteAccount(req: RequestWithUser, res: Response) {
  try {
    let wallet = await walletRepository.findOne({where: {user: req.user.id}})

    if (wallet == null) {
      return errorHandler(res, "You don't have a wallet yet", 404)
    }
    const customerAccount = await (await blochq.getCustomerAccount(wallet.accountId)).unwrap();

    console.log(customerAccount)

    const closure = await (await blochq.deleteFixedAccount(customerAccount.data.id, "Customer requested closure")).unwrap();

    await walletRepository.update({user: req.user.id}, {accountId: undefined})

    console.log(closure)

    wallet.accountId = "";

    successHandler(res, "User wallet deleted successfully", wallet);
  } catch (e: any) {
    console.error(e)
    return errorHandler(res, UNHANDLED_ERROR(e))
  }
}

export async function transferToExternalAccount(req: RequestWithUser, res: Response) {
  try {
    const {bank_code, account_number, amount, narration } = req.body;

    const wallet = await walletRepository.findOne({where: {user: req.user.id}})

    if (wallet == null) {
      return errorHandler(res, "You don't have a wallet yet", 404)
    }

    const txRef = randomString(32);

    const fee = Math.round(FEES(amount))
    const amountWithFee = amount + fee;

    const accountBalance = await (await blochq.getCustomerAccount(wallet.accountId)).unwrap();

    if (accountBalance.data.balance < amountWithFee) return errorHandler(res, "Your account balance is not enough", 403);

    const melonOrgAccount = await ACCOUNT_DETAILS();

    console.log(melonOrgAccount)

    const transfer = await (await blochq.transferFromFixedAccount(amount, wallet.accountId, {bankCode: bank_code, accountNumber: account_number}, {narration, reference: txRef})).unwrap()
    const transferToOrgAccount = await (await blochq.transferFromFixedAccount(fee, wallet.accountId, {
      bankCode: melonOrgAccount.bankCode,
      accountNumber: melonOrgAccount.accountNumber
    }, {
      narration: "Fees for tx " + txRef,
      reference: "M_" + txRef
    })).unwrap();

    console.log({transfer, transferToOrgAccount})

    successHandler(res, "Transfer successful", {transfer, fees: transferToOrgAccount})

  } catch (e: any) {
    console.error(e)
    return errorHandler(res, e.message || "Unable to perform action, please try again")
  }
}

export function calculateFees(req: Request, res: Response) {
  const {amount} = req.body;
  console.log(amount)

  if (amount == undefined) return errorHandler(res, "");

  return successHandler(res, "Fees calculated successfully", {fee: FEES(amount)})
}

export async function getBanksList(_: RequestWithUser, res: Response) {
  try {
    const banks = await (await getBanks()).unwrap()

    successHandler(res, "Banks fetched", {banks: banks.data})
  } catch (e: any) {
    console.error(e)
    return errorHandler(res, e.message || "Unable to perform action, please try again")
  }
}

export async function resolveAccount(req: RequestWithUser, res: Response) {
  try {
    const {accountNumber, bankCode} = req.body;

    const account = await (await blochq.resolveAccount(accountNumber, bankCode)).unwrap();

    console.log(account)

    successHandler(res, "Account resolved", {account: account.data})
  } catch (e: any) {
    console.error(e)
    errorHandler(res, e.message || "Unable to perform action, please try again")
  }
}
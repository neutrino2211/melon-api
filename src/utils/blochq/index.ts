import { type User } from "../../models/User";
import { RequestWithUser } from "../api";
import { Result } from "../types";
import { BlocResponse, AccountCreated, WalletCreated, FixedAccountCreated, BlocErrorResponse, TransferSuccessful, ExternalAccount, KYCT1Upgrade, Transaction } from "./types";
import { makeBlocPostRequest, makeBlocGetRequest, makeBlocDeleteRequest } from "./util";



export async function createCustomer(user: User): Promise<Result<BlocResponse<AccountCreated>, BlocErrorResponse<{}>>> {
  console.log(user)
  const names = user.name.split(' ').filter(n => n.trim() != "")
  const res = await makeBlocPostRequest("/customers", {
    email: user.email,
    phone_number: user.phone,
    first_name: names[0],
    last_name: names[names.length-1],
    customer_type: "Personal",
    bvn: user.bvn,
  })

  if (!res.ok) {
    return Result.err(await res.json() as BlocErrorResponse<{}>)
  }

  return Result.ok(await res.json() as BlocResponse<AccountCreated>)
}

export async function createCustomerWallet(user: User, customerId: string): Promise<Result<BlocResponse<WalletCreated>, BlocErrorResponse<{}>>> {
  const res = await makeBlocPostRequest("/wallets", {
    customer_id: customerId,
    preferred_bank: 'Wema',
    alias: 'Melon - ' + user.name
  })

  if (!res.ok) {
    return Result.err(await res.json() as BlocErrorResponse<{}>);
  }

  return Result.ok(await res.json() as BlocResponse<WalletCreated>)
}

export async function createFixedAccount(user: User, customerId: string): Promise<Result<BlocResponse<FixedAccountCreated>, BlocErrorResponse<any>>> {
  const res = await makeBlocPostRequest("/accounts", {
    customer_id: customerId,
    preferred_bank: 'Wema',
    alias: 'Melon'
  })

  if (!res.ok) {
    return Result.err(await res.json() as BlocErrorResponse<any>);
  }

  return Result.ok(await res.json() as BlocResponse<FixedAccountCreated>);
}

export async function getAccountTransactions(accountId: string): Promise<Result<BlocResponse<Transaction[]>, BlocErrorResponse<{}>>> {
  const res = await makeBlocGetRequest("/transactions?account_id=" + accountId);

  if (!res.ok) return Result.err(await res.json() as BlocErrorResponse<{}>)

  return Result.ok(await res.json() as BlocResponse<Transaction[]>)
}

export async function getCustomerAccount(id: string): Promise<Result<BlocResponse<FixedAccountCreated>, BlocErrorResponse<{}>>> {
  const res = await makeBlocGetRequest("/accounts/" + id);

  if (!res.ok) {
    return Result.err(await res.json() as BlocErrorResponse<{}>)
  }

  return Result.ok(await res.json() as BlocResponse<FixedAccountCreated>);
}

export async function transferFromFixedAccount(
  amount: number,
  from: string,
  to: {bankCode: string, accountNumber: string},
  meta: {narration: string, reference: string}
): Promise<Result<BlocResponse<TransferSuccessful>, BlocErrorResponse<{}>>> {
  const res = await makeBlocPostRequest("/transfers", {
    amount: amount,
    account_id: from,
    bank_code: to.bankCode,
    account_number: to.accountNumber,
    narration: meta.narration,
    reference: meta.reference
  })

  if (!res.ok) {
    return Result.err(await res.json() as BlocErrorResponse<{}>)
  }

  return Result.ok(await res.json() as BlocResponse<TransferSuccessful>)
}

export async function upgradeKycToTierOne(dob: string, photo: string, pob: string, country: string, gender: string, address: any): Promise<Result<BlocResponse<KYCT1Upgrade>, BlocErrorResponse<{}>>> {
  const res = await makeBlocPostRequest("/customers/upgrade/t1", {
    dob,
    place_of_birth: pob,
    country,
    gender,
    address,
    photo
  })

  if (!res.ok) {
    return Result.err(await res.json() as BlocErrorResponse<{}>)
  }

  return Result.ok(await res.json() as BlocResponse<KYCT1Upgrade>)
}

export async function resolveAccount(accountNumber: string, bankCode: string): Promise<Result<BlocResponse<ExternalAccount>, BlocErrorResponse<{}>>> {
  const res = await makeBlocGetRequest("/resolve-account?account_number=" + accountNumber + "&bank_code=" + bankCode)

  if (!res.ok) {
    return Result.err(await res.json() as BlocErrorResponse<{}>)
  }

  return Result.ok(await res.json() as BlocResponse<ExternalAccount>)
}


export async function deleteCustomer(customerId: string): Promise<Result<BlocResponse<any>, BlocErrorResponse<any>>> {
  const res = await makeBlocDeleteRequest("/customer/" + customerId);
  const text = await res.text()

  console.log(text)

  if (!res.ok) return Result.err(JSON.parse(text) as BlocErrorResponse<any>);

  return Result.ok(JSON.parse(text) as BlocResponse<{}>)
}

export async function deleteFixedAccount(accountId: string, closureReason: string): Promise<Result<BlocResponse<any>, BlocErrorResponse<any>>> {
  const res = await makeBlocPostRequest("/accounts/" + accountId + "/close", {
    reason: closureReason
  });
  const text = await res.text() || "{}";

  console.log(text)

  if (!res.ok) return Result.err(JSON.parse(text) as BlocErrorResponse<{}>);

  return Result.ok(JSON.parse(text) as BlocResponse<{}>)
}

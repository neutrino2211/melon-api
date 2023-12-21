import { Result } from "../types";
import { BlocResponse, BankDetails, BlocErrorResponse } from "./types";

const PRIVATE_KEY = process.env.BLOCHQ_PRIVATE_KEY!!;
const PUBLIC_KEY = process.env.BLOCHQ_PUBLIC_KEY!!;

const API_URL = 'https://api.blochq.io/v1';

console.log(PRIVATE_KEY)

export const ACCOUNT_DETAILS = async () => {
  return {
    bank: "Sterling",
    accountNumber: "8731278924",
    bankCode: (await (await getBanks()).unwrap()).data.filter(b => b.bank_name.toLowerCase() === "sterling bank plc")[0].bank_code
  }
}

export const FEES = (amount: number) => {
  let fee = 0;

  if (amount <= 5_000_00) fee = 10_00;
  else if (amount <= 50_000_00) fee = 20_00;
  else fee = 45_00;

  return fee + 10_00; // NGN 10 on top of the original blochq pricing (https://arc.net/l/quote/ynkkpyoe)
}

export async function makeBlocPostRequest<T>(path: string, data: T) {
  return await fetch(API_URL + path, {
    method: "POST",
    headers: {
      'Content-Type': "application/json",
      'Authorization': 'Basic ' + PRIVATE_KEY
    },      
    body: JSON.stringify(data)
  })
}

export async function makeBlocGetRequest(path: string) {
  return fetch(API_URL + path, {
    method: "GET",
    headers: {
      'Authorization': 'Basic ' + PRIVATE_KEY
    },
  })
}

export async function getBanks(): Promise<Result<BlocResponse<BankDetails[]>, BlocErrorResponse<{}>>> {
  const res = await makeBlocGetRequest("/banks");

  if (!res.ok) {
    return Result.err(await res.json() as BlocErrorResponse<{}>);
  }

  return Result.ok(await res.json() as BlocResponse<BankDetails[]>)
}
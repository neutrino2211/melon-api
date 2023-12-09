import { type User } from "../models/User";
import { Result } from "./types";

const PRIVATE_KEY = process.env.BLOCHQ_PRIVATE_KEY!!;
const PUBLIC_KEY = process.env.BLOCHQ_PUBLIC_KEY!!;

const API_URL = 'https://api.blochq.io/v1';

export interface BlocResponse<T> {
  success: boolean
  data: T
  message: string
}

export interface WalletCreated {
  id: string
  name: string
  created_at: string
  account_number: string
  bank_name: string
  balance: number
  customer: Customer
}

export interface WalletFetched {
  id: string
  name: string
  created_at: string
  account_number: string
  bank_name: string
  balance: number
  customer: Customer
}

export interface Customer {
  id: string
  email: string
  status: string
  kyc_tier: string
  phone_number: string
  first_name: string
  last_name: string
  customer_type: string
  bvn: string
}

export interface AccountCreated {
  id: string
  full_name: string
  phone_number: string
  organization_id: string
  environment: string
  email: string
  country: string
  group: string
  status: string
  created_at: string
  updated_at: string
  first_name: string
  last_name: string
  kyc_tier: string
  bvn: string
  date_of_birth: string
  customer_type: string
  source: string
  address: Address
}

export interface Address {
  street: string
}

type CustomerCreationError = Error;
type WalletCreationError = Error;
type BlocErrorResponse<T> = BlocResponse<T> & Error;



async function makeBlocPostRequest<T>(path: string, data: T) {
  return await fetch(API_URL + path, {
    method: "POST",
    headers: {
      'Content-Type': "application/json",
      'Authorization': 'Basic ' + PRIVATE_KEY
    },      
    body: JSON.stringify(data)
  })
}

async function makeBlocGetRequest(path: string) {
  return fetch(API_URL + path, {
    method: "GET",
    headers: {
      'Authorization': 'Basic ' + PRIVATE_KEY
    },
  })
}

export async function createCustomer(user: User): Promise<Result<BlocResponse<AccountCreated>, Error>> {
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
    return Result.err<BlocResponse<AccountCreated>, CustomerCreationError>(await res.json() as CustomerCreationError)
  }

  return Result.ok<BlocResponse<AccountCreated>, CustomerCreationError>(await res.json() as BlocResponse<AccountCreated>)
}

export async function createCustomerWallet(user: User, customerId: string): Promise<Result<BlocResponse<WalletCreated>, WalletCreationError>> {
  const res = await makeBlocPostRequest("/wallets", {
    customer_id: customerId,
    preferred_bank: 'providus',
    alias: 'Melon - ' + user.name
  })

  if (!res.ok) {
    return Result.err<BlocResponse<WalletCreated>, WalletCreationError>(await res.json() as WalletCreationError);
  }

  return Result.ok<BlocResponse<WalletCreated>, WalletCreationError>(await res.json() as BlocResponse<WalletCreated>)
}

export async function getCustomerWallet(id: string): Promise<Result<BlocResponse<WalletFetched>, BlocErrorResponse<{}>>> {
  const res = await makeBlocGetRequest("/wallets/" + id);

  if (!res.ok) {
    return Result.err<BlocResponse<WalletFetched>, BlocErrorResponse<{}>>(await res.json() as BlocErrorResponse<{}>)
  }

  return Result.ok<BlocResponse<WalletFetched>, BlocErrorResponse<{}>>(await res.json() as BlocResponse<WalletFetched>);
}
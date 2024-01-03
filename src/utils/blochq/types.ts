
export interface BlocResponse<T> {
  success: boolean
  data: T
  message: string
  metadata?: Metadata
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

export interface Transaction {
  id: string
  created_at: string
  updated_at: string
  amount: number
  reference: string
  status: string
  shared: boolean
  currency: string
  environment: string
  payment_method: string
  provider: string
  payment_type: string
  source: string
  meta_data: TransactionMetaData
  organization_id: string
  customer_id: string
  fee: number
  billing_id: string
  customer_detail: CustomerDetail
  reversal: boolean
  reversed_transaction_id: string
  current_account_balance: number
  account_id: string
  card_id: string
  drcr: string
  operator_id: string
  operator_detail: OperatorDetail
}

export interface TransactionMetaData {
  sender_account_name: string
  sender_bank_name: string
}

export interface CustomerDetail {
  full_name: string
  phone_number: string
  email: string
  country: string
}

export interface OperatorDetail {
  full_name: string
  phone_number: string
}

export interface Metadata {
  has_next: boolean
  has_previous: boolean
}

export interface NewTransactionWebhook {
  id: string
  created_at: string
  updated_at: string
  amount: number
  reference: string
  status: string
  shared: boolean
  currency: string
  environment: string
  payment_method: string
  provider: string
  payment_type: string
  source: string
  meta_data: any
  organization_id: string
  customer_id: string
  fee: number
  billing_id: string
  customer_detail: CustomerDetail
  reversal: boolean
  previous_account_balance: number
  current_account_balance: number
  account_id: string
  drcr: string
}

export interface BillPayment {
  created_at: string
  status: string
  amount: number
  reference: string
  customer_name: string
  operator_id: string
  product_id: string
  bill_type: string
  meta_data: BillPaymentMetaData
}

export interface BillPaymentMetaData {
  operator_name: string
  token: string
}

export interface BillProvider {
  desc: string
  id: string
  name: string
  sector: string
}

export interface BillProviderProduct {
  category: string
  desc: any
  fee_type: string
  id: string
  meta: any
  name: string
  operator: string
}

export interface CustomerDetail {
  full_name: string
  phone_number: string
  country: string
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

export interface BankDetails {
  bank_name: string
  short_code: string
  bank_code: string
}

export interface TransferSuccessful {
  reference: string
  account_id: string
  recipient_account_number: string
  recipient_account_name: string
  amount: number
  narration: string
  currency: string
  status: string
  create_at: string
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

export interface FixedAccountCreated {
  id: string
  name: string
  preferred_bank: string
  bvn: string
  kyc_tier: string
  created_at: string
  updated_at: string
  status: string
  environment: string
  organization_id: string
  balance: number
  currency: string
  meta_data: any
  customer_id: string
  customer: Customer
  account_number: string
  bank_name: string
  type: string
  collection_account: boolean
  hide_account: boolean
  SkipNumber: boolean
  managers: any
  external_account: ExternalAccount
  alias: string
  collection_rules: CollectionRules
}

export interface ExternalAccount {account_number: string, account_name: string}

export interface CollectionRules {
  frequency: number
  amount: number
}

export interface KYCT1Upgrade {
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
  kyc_status: string
  bvn: string
  place_of_birth: string
  gender: string
  image_url: string
  date_of_birth: string
  customer_type: string
  source: string
  address: Address
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
  city?: string
  state?: string
  country?: string
  postal_code?: string
}

export type BlocErrorResponse<T> = BlocResponse<T> & Error;
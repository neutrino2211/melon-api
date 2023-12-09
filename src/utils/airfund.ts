import { Result } from "./types"

const API_KEY = Buffer.from(process.env.AIRFUND_USER!!+":"+process.env.AIRFUND_PASS!!).toString("base64")
const API_URL = "https://airfund.ng/api/v1"
const NETWORK_CODES = {
  'MTN': 1,
  '9MOBILE': 2
}

type AirfundATCError = Error & {msg: string}
type AirfundATCSuccess = {};

export async function makeFundingRequest(phone: string, network: 'MTN' | '9MOBILE', amount: string, pin: string) {
  console.log(API_KEY)
  const res = await fetch(API_URL + "/airtime-to-cash", {
    method: "POST",
    headers: {
      'Content-Type': "application/json",
      'Authorization': 'Basic ' + API_KEY
    },
    body: JSON.stringify({
      network_id: NETWORK_CODES[network],
      sender: phone,
      amount,
      pin
    })
  })

  if (!res.ok) {
    return Result.err<AirfundATCSuccess, AirfundATCError>(await res.json() as AirfundATCError)
  }

  return Result.ok<AirfundATCSuccess, AirfundATCError>(await res.json() as AirfundATCSuccess)
}
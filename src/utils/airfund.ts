const API_KEY = Buffer.from(process.env.AIRFUND_USER!!+":"+process.env.AIRFUND_PASS!!).toString("base64")
const API_URL = "https://airfund.ng/api/v1"
const NETWORK_CODES = {
  'MTN': 1,
  '9MOBILE': 2
}

export async function makeFundingRequest(phone: string, network: 'MTN' | '9MOBILE', amount: string, pin: string) {
  console.log(API_KEY)
  const res = await fetch(API_URL + "/fund-requests", {
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
  }).then(r => r.json()).catch(console.error)

  return res
}
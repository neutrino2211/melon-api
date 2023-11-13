const API_ADDRESS = {
  development: "http://127.0.0.1:5001/melon-ef5d8/us-central1",
  production: "https://us-central1-melon-ef5d8.cloudfunctions.net"
}[process.env.NODE_ENV || "production"]

export default async function sendEmail(to: string, title: string, body: string) {
  console.log(API_ADDRESS)
  const res = await fetch(API_ADDRESS + "/melonMailer", {
    method: "POST",
    headers: {
      'Content-Type': "application/json"
    },
    body: JSON.stringify({
      to,
      title,
      body
    })
  })

  console.log(await res.text())
}
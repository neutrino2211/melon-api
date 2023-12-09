import { makeFundingRequest } from "../src/utils/airfund";

async function main() {
  const res = await makeFundingRequest("08092213372", "9MOBILE", "20", "1831")

  if (res.isOk()) {
    console.log(await res.unwrap())
  } else {
    console.error("error", await res.error())
  }
}

main()
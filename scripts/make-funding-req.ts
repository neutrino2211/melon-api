import { makeFundingRequest } from "../src/utils/airfund";

makeFundingRequest("08092213372", "9MOBILE", "20", "1831").then(console.log).catch(console.error);
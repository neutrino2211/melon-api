import { Response } from "express";
import { RequestWithUser, UNHANDLED_ERROR, assertError, errorHandler, successHandler } from "../../utils/api";
import { BillPaymentProviders } from "../../utils/blochq/util";

import * as blochq from "../../utils/blochq";

export async function getProducts(req: RequestWithUser, res: Response) {
  const {provider, operator} = req.body as {provider: BillPaymentProviders, operator: string};

  try {
    const products = await (await blochq.getOperatorProducts(provider, operator)).unwrap();

    successHandler(res, "Products fetched successfully", {products: products.data});
  } catch (e: any) {
    console.error(e)
    errorHandler(res, UNHANDLED_ERROR(e))
  }
}

export async function getProvider(req: RequestWithUser, res: Response) {
  const {provider} = req.body as {provider: BillPaymentProviders};

  try {
    if (assertError(res, provider !== BillPaymentProviders.electricity && provider !== BillPaymentProviders.telco && provider !== BillPaymentProviders.television)) return;

    const operators = await (await blochq.getSupportedOperators(provider)).unwrap();

    successHandler(res, "Operators fetched successfully", {operators: operators.data});
  } catch (e) {
    console.error(e);
    errorHandler(res, UNHANDLED_ERROR(e))
  }
}

export async function validateDevice(req: RequestWithUser, res: Response) {
  const {operator, provider, deviceNumber} = req.body as {provider: BillPaymentProviders, operator: string, deviceNumber: string};

  try {
    if (assertError(res, provider !== BillPaymentProviders.electricity && provider !== BillPaymentProviders.telco && provider !== BillPaymentProviders.television)) return;
    
    const valid = await blochq.validateDevice(provider, operator, deviceNumber);

    successHandler(res, "Device validated", {valid});
  } catch (e) {
    console.error(e);
    errorHandler(res, UNHANDLED_ERROR(e))
  }
}

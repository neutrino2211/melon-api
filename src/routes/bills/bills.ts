import { Response } from "express";
import { RequestWithUser, UNHANDLED_ERROR, assertError, errorHandler, successHandler } from "../../utils/api";
import { BillPaymentProviders } from "../../utils/blochq/util";

import * as blochq from "../../utils/blochq";
import { walletRepository } from "../../utils/data-source";

export async function getProducts(req: RequestWithUser, res: Response) {
  const {provider, operator} = req.body as {provider: BillPaymentProviders, operator: string};

  try {
    console.log(provider, operator)
    if (assertError(res, provider !== BillPaymentProviders.electricity && provider !== BillPaymentProviders.telco && provider !== BillPaymentProviders.television)) return;

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
  console.log(req.body);

  try {
    if (assertError(res, provider !== BillPaymentProviders.electricity && provider !== BillPaymentProviders.telco && provider !== BillPaymentProviders.television)) return;
    
    const valid = await blochq.validateDevice(provider, operator, deviceNumber);

    successHandler(res, "Device validated", {valid});
  } catch (e) {
    console.error(e);
    errorHandler(res, UNHANDLED_ERROR(e))
  }
}

export async function payBill(req: RequestWithUser, res: Response) {
  const {operator, provider, deviceNumber, amount, product} = req.body as {provider: BillPaymentProviders, operator: string, deviceNumber: string, amount: number, product: string};
  console.log(req.body)

  if (assertError(res, amount <= 0)) return;
  if (assertError(res, provider !== BillPaymentProviders.electricity && provider !== BillPaymentProviders.telco && provider !== BillPaymentProviders.television)) return;

  try {
    const wallet = await walletRepository.findOne({where: {user: req.user.id}});

    if (wallet == null) return errorHandler(res, "wallet does not exist", 404);

    const payment = await (await blochq.payBill(provider, operator, wallet.accountId, product, deviceNumber, amount)).unwrap();

    successHandler(res, "Payment successful", {payment});
  } catch (error) {
    console.error(error);
    errorHandler(res, UNHANDLED_ERROR(error));
  }
}

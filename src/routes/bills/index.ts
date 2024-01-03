import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import { getProducts, getProvider, payBill, validateDevice } from "./bills";

export default function load(app: Router) {
  app.post("/bills/providers", authMiddleware as any, getProvider as any);
  app.post("/bills/products", authMiddleware as any, getProducts as any);

  app.post('/bills/pay', authMiddleware as any, payBill as any);
  app.post("/bills/device/validate", authMiddleware as any, validateDevice as any);
}
import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import { getBalance } from "./balance";
import { createWallet, getAccountDetails } from "./account";

export default function load(app: Router) {
    app.get("/wallet/balance", authMiddleware as any, getBalance as any)
    app.get("/wallet", authMiddleware as any, getAccountDetails as any)

    app.post("/wallet", authMiddleware as any, createWallet as any)
}
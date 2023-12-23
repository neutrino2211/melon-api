import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import { getBalance } from "./balance";
import { calculateFees, createWallet, getAccountDetails, getBanksList, resolveAccount, transferToExternalAccount } from "./account";

export default function load(app: Router) {
    app.get("/wallet/balance", authMiddleware as any, getBalance as any)
    app.get("/wallet", authMiddleware as any, getAccountDetails as any)

    app.post("/wallet", authMiddleware as any, createWallet as any)
    app.post("/wallet/transfer", authMiddleware as any, transferToExternalAccount as any)
    

    app.get("/misc/banks", authMiddleware as any, getBanksList as any)
    app.post("/misc/resolve-account", authMiddleware as any, resolveAccount as any)

    app.post("/wallet/fees", calculateFees)
}
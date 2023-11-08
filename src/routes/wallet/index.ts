import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import { getBalance } from "./balance";

export default function load(app: Router) {
    app.get("/wallet/balance", authMiddleware as any, getBalance as any)
}
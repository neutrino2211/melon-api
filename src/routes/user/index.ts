import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import { upgradeKycToTierOne } from "./kyc";
import { getLoggedInUser, setUserPhoto } from "./user";

export default function load(app: Router) {
  app.post("/user/kyc/1", authMiddleware as any, upgradeKycToTierOne as any);

  app.post("/user/photo", authMiddleware as any, setUserPhoto as any);

  app.get('/me', authMiddleware as any, getLoggedInUser as any);
}
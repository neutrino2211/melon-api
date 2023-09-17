import { Router } from "express";
import { signUp, confirmSignup, setPersonalDetails, setPin } from "./signup";
import { authMiddleware } from "../../middleware/auth";
import { login } from "./login";

export default function load(app: Router) {
    app.post("/auth/signup", signUp)
    app.post("/auth/signup/confirm", confirmSignup)

    app.post('/auth/personaldetails', authMiddleware as any, setPersonalDetails as any)
    app.post('/auth/pin', authMiddleware as any, setPin as any)

    app.post('/auth/login', login);
}
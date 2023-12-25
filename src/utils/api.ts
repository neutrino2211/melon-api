import { Response, Request } from "express";
import { User } from "../models/User";

const unhadledErrorMessage = "Unable to perform action, please try again"

export type RequestWithUser = Request & {user: User}

export function successHandler(res: Response, message: string, data: any) {
    res.json({
        success: true,
        message,
        data
    })
}

export function errorHandler(res: Response, message: string, code: number = 500) {
    res.status(code).json({
        success: false,
        message,
    })
}

export function assertError(res: Response, condition: boolean) {
    if (condition) errorHandler(res, "Invalid data", 422);
    return condition;
}

export const UNHANDLED_ERROR = (e: any) => e ? e.message || unhadledErrorMessage : unhadledErrorMessage; 

export const genToken = () => Math.random().toString().split('.')[1].slice(0, 6);
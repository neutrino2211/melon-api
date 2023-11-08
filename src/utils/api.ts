import { Response, Request } from "express";
import { User } from "../models/User";

export type RequestWithUser = Request & {user: User}

export function successHandler(res: Response, message: string, data: any) {
    res.json({
        success: true,
        message,
        data
    })
}

export function errorHandler(res: Response, message: string, code: number = 500) {
    res.json({
        success: false,
        message,
    }).status(code)
}

export const genToken = () => Math.random().toString().split('.')[1].slice(0, 6);
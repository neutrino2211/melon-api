import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { Response, Request } from "express";
import { Database } from "./database.types";

export type RequestWithUser = Request & {user: Database['public']['Tables']['users']['Row']}

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

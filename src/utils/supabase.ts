import { createClient } from "@supabase/supabase-js";
import { existsSync, writeFileSync, readFileSync } from "fs";
import { Database } from "./database.types";
const JSON_FILE = __dirname + "/../../auth.json";

if (!existsSync(JSON_FILE)) {
    writeFileSync(JSON_FILE, "{}")
}

export const client = createClient<Database>(process.env.SUPABASE_DOMAIN || "", process.env.SUPABASE_PUBLIC_KEY || "", {
    auth: {
        persistSession: true,
        storage: {
            getItem (key: string) {
                return JSON.parse(readFileSync(JSON_FILE).toString('utf-8'))[key]
            },

            setItem(key: string, value: any) {
                const obj = JSON.parse(readFileSync(JSON_FILE).toString('utf-8'))
                obj[key] = value;
                writeFileSync(JSON_FILE, JSON.stringify(obj))
            },

            removeItem(key: string) {
                const obj = JSON.parse(readFileSync(JSON_FILE).toString('utf-8'))
                delete obj[key]
                writeFileSync(JSON_FILE, JSON.stringify(obj))
            },
        }
    }
});

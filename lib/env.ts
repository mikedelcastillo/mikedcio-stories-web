import { v4 as uuid4 } from "uuid"

export const ADMIN_TOKEN = getEnv("ADMIN_TOKEN", uuid4())
export const DATABASE_URL = getEnv("DATABASE_URL", uuid4())

export function getEnv<T>(key: string, def: T): T {
    if(key in process.env){
        const val = process.env[key]
        if(typeof def === "string"){
            if(typeof val === "string"){
                return val as T
            }
        }
        if(typeof def === "number"){
            const number = Number(val)
            if(!isNaN(number)){
                return number as T
            }
        }
        if(typeof def === "boolean"){
            if(typeof val === "boolean") return val
            else if(typeof val === "string"){
                return (val !== "false") as T
            }   
        }
    }
    return def
}
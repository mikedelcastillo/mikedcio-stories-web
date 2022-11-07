import createHttpError, { HttpError } from "http-errors"
import { NextApiRequest, NextApiResponse } from "next"
import { AnySchema, ValidationError } from "yup"
import { ADMIN_TOKEN } from "./env"

export type Middleware = (req: NextApiRequest, res: NextApiResponse, next?: () => void) => Promise<void>

export const middlewareChain = <T = any>(...middlewares: Middleware[]) => async (req: NextApiRequest, res: NextApiResponse<T>): Promise<void> => {
    let index
    for(index = 0; index < middlewares.length; index++){
        const middleware = middlewares[index]
        try{
            await middleware(req, res)
        } catch(e){
            const status = (e as HttpError).status ?? 500
            res.status(status).json({
                name: (e as Error).name,
                message: (e as Error).message,
            } as T) // Force T since it's an error
            break
        }
    }
}

export const validateRequest = (requestKey: keyof NextApiRequest, schema: Record<string, AnySchema>) => async (req: NextApiRequest): Promise<void> => {
    type E = {
        prop: string,
        error: Error,
    }
    const errors: E[] = []
    for(const prop in schema){
        const validation = schema[prop]
        const value = req[requestKey][prop]
        try{
            await validation.validate(value)
        } catch(e){
            errors.push({
                prop,
                error: e as Error,
            })
        }
    }
    if(errors.length !== 0){
        console.log(errors)
        throw createHttpError(422, errors.map(e => `${e.prop}: ${e.error.message}`).join("; "))
    }
}

export const validateAdmin = async (req: NextApiRequest) => {
    if(req.headers.authorization !== ADMIN_TOKEN){
        throw createHttpError(401, "Sorry. This endpoint is only for me. 🫤")
    }
}
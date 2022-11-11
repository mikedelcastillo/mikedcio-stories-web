import { MediaType } from "@prisma/client"
import createHttpError from "http-errors"
import { NextApiRequest, NextApiResponse } from "next"
import * as yup from "yup"

import { middlewareChain, validateAdmin, validateRequest } from "../../../lib/middlewares"
import { unwrapOr, unwrapOrDefault } from "../../../lib/utils"
import { prisma } from "../../../prisma/database"

export default middlewareChain(
    validateAdmin,
    async (req, res) => {
        if(req.method === "POST"){
            await post(req, res)
            return
        } 
        await get(req, res)
    },
)

async function get(req: NextApiRequest, res: NextApiResponse) {
    //
    res.json({ok: false})
}

async function post(req: NextApiRequest, res: NextApiResponse){
    await validateRequest("body", {
        id: yup.string().required(),
        type: yup.string().required(),

        source: yup.string().required(),
        thumb: yup.string().nullable(true),
        lq: yup.string().nullable(true),
        hq: yup.string().nullable(true),

        width: yup.number(),
        height: yup.number(),
        length: yup.number(),

    })(req)

    const id = unwrapOrDefault("string", req.body.id)
    const type = unwrapOrDefault("string", req.body.type) as MediaType

    const types = Object.keys(MediaType)
    if(!types.includes(type)){
        throw createHttpError(422, `Type '${type}' is not of type MediaType[${types.join()}]`)
    }

    const source = unwrapOrDefault("string", req.body.source)
    const thumb = unwrapOr("string", req.body.thumb, null)
    const lq = unwrapOr("string", req.body.lq, null)
    const hq = unwrapOr("string", req.body.hq, null)

    const width = unwrapOrDefault("number", req.body.width)
    const height = unwrapOrDefault("number", req.body.height)
    const length = unwrapOrDefault("number", req.body.length)


    const data = {
        id,
        type,
        source,
        thumb,
        lq,
        hq,
        width,
        height,
        length,
    }

    await prisma.media.upsert({
        where: {
            id,
        },
        update: {
            ...data,
            updatedAt: new Date(),
        },
        create: {
            ...data,
            updatedAt: new Date(),
        },
    })

    res.json(data)
}
import { MediaType, StoryPostContentDisplayMethod, StoryPostContentType } from "@prisma/client"
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
        
        title: yup.string(),
        caption: yup.string(),

        contentType: yup.string().required(),

        contentLink: yup.string().nullable(true),

        contentMediaId: yup.string().nullable(true),
        contentMediaDisplay: yup.string(),

        contentGroupId: yup.string().nullable(true),
    })(req)

    const id = unwrapOrDefault("string", req.body.id)
    const title = unwrapOrDefault("string", req.body.title)
    const caption = unwrapOrDefault("string", req.body.caption)

    const contentType = unwrapOrDefault("string", req.body.contentType) as StoryPostContentType
    if(!(contentType in StoryPostContentType)){
        throw createHttpError(422, `ContentType ${contentType} is not part of StoryPostContentType[${Object.keys(StoryPostContentType)}]`)
    }

    const contentLink = unwrapOr("string", req.body.contentLink, null)

    const contentMediaId = unwrapOr("string", req.body.contentMediaId, null)
    const contentMediaDisplay: StoryPostContentDisplayMethod = (() => {
        const input = unwrapOrDefault("string", req.body.contentMediaDisplay)

        if(input in StoryPostContentDisplayMethod){
            return StoryPostContentDisplayMethod[input as keyof typeof StoryPostContentDisplayMethod]
        }

        return StoryPostContentDisplayMethod.CONTAIN
    })()

    const contentGroupId = unwrapOr("string", req.body.contentGroupId, null)

    // Validate input
    if(contentType === StoryPostContentType.MEDIA){
        if(contentMediaId === null){
            throw createHttpError(422, "ContentType is MEDIA but contentMediaId is null")
        }
    }
    if(contentType === StoryPostContentType.LINK){
        if(contentLink === null){
            throw createHttpError(422, "ContentType is LINK but contentLink is null")
        }
    }
    if(contentType === StoryPostContentType.GROUP){
        if(contentGroupId === null){
            throw createHttpError(422, "ContentType is GROUP but contentGroupId is null")
        }
    }

    const data = {
        id,
        title,
        caption,
        contentType,
        contentLink,
        contentMediaId,
        contentMediaDisplay,
        contentGroupId,
    }

    await prisma.storyPost.upsert({
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
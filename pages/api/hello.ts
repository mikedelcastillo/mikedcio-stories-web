// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import { ADMIN_TOKEN } from "../../lib/env"
import { middlewareChain, validateAdmin, validateRequest } from "../../lib/middlewares"
import * as yup from "yup"

export default middlewareChain(
    // validateRequest("query", {
    //     code: yup.string(),
    // }),
    validateAdmin,
    async (req, res) => {
        res.json("hello")
    },
)

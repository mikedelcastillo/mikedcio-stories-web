import { middlewareChain, validateAdmin } from "../../../lib/middlewares"

export default middlewareChain(
    // validateRequest("query", {
    //     code: yup.string(),
    // }),
    validateAdmin,
    async (req, res) => {
        res.json("hello")
    },
)

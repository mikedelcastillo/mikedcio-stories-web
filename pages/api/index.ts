import { middlewareChain, validateAdmin } from "../../lib/middlewares"

export default middlewareChain(
    validateAdmin,
    async (req, res) => {
        res.json({ ok: true })
    },
)

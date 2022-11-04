import type { NextApiRequest, NextApiResponse } from 'next'
import { SOCIAL_LINKS } from '../../../lib/constants'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    const id = req.query.id as string
    const socialLink = SOCIAL_LINKS.find(link => link.id === id)

    if(typeof socialLink === "undefined"){
        res.redirect("/")
    } else{
        res.redirect(socialLink.href)
    }
}

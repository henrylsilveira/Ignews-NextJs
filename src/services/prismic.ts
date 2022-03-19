import Prismic from '@prismicio/client'
import { read } from 'fs'

export function getPrismicClient(req?: unknown){
    const prismic = Prismic.client(
        process.env.PRISMIC_ENDPOINT,
        {
            req: req,
            accessToken: process.env.PRISMIC_ACCESS_TOKEN
        }
    )

    return prismic
}
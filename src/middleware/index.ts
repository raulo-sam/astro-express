import type { MarkdownHeading } from "@astrojs/markdown-remark"
import { defineMiddleware } from "astro/middleware"
import { Log, generateLocalsByConfig as generateLocals, readConfigFile } from "./middleware-utils"
import fs from 'fs'
export interface Locals {
    currentPage: {
        contentHtml: string,
        contentRaw: string,
        metadata: {
            headings: MarkdownHeading[];
            imagesPaths: Set<string>;
            frontmatter: Record<string, any>;
        }
    },
    routes: string[]
}

const middleware = defineMiddleware(async(context, next) => {
    const { input } = await readConfigFile()
    let routes = []
    routes = await fs.promises.readdir(input, {recursive: true})
    routes = routes.filter(item => item.endsWith('.md')).map(item=> item.replace('.md','').replace(/\\/g, '/')) || []
    if(!routes.some(route => route === context.url.pathname.replace('/',''))) {
        return context.redirect('/home')
    }
    next()
})

export const onRequest = middleware;
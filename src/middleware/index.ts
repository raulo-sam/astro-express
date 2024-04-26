import type { MarkdownHeading } from "@astrojs/markdown-remark"
import { defineMiddleware } from "astro/middleware"
import { Log, readConfigFile } from "./middleware-utils"
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
    // const { input } = await readConfigFile()
    console.log({context})
    const input = './pages'
    console.log("==============")
    let routes = []
    routes = await fs.promises.readdir(input, {recursive: true})
    console.log({routes})
    routes = routes.filter(item => item.endsWith('.md')).map(item=> item.replace('.md','').replace(/\\/g, '/')) || []
    // if(!routes.some(route => route === context.url.pathname.replace('/',''))) {
    //     console.log({routes})
    //     console.log(context.url.pathname.replace('/',''))
    //     return context.redirect('/home')
    // }
    console.log('next')
    next()
})

export const onRequest = middleware;
// import type { MiddlewareResponseHandler } from "astro";
import type { MarkdownHeading } from "@astrojs/markdown-remark"
import { defineMiddleware } from "astro/middleware"
import { Log, generateLocalsByConfig as generateLocals, readConfigFile } from "./middleware-utils"


// const middleware = (context, next, a, b) => {
//     console.log("MIDDLEWARE");

//     // console.log(context.url.searchParams.get('text'))
//     const text = context.url.searchParams.get('text') || ''

//     fs.writeFile('test.txt', text, (err) => {
//         console.log({err})
//     })
//     // return context.redirect('/aboutasdf', 200)
//     // return new Response(
//     //   JSON.stringify({
//     //     message: "Hello world",
//     //   }),
//     //   {
//     //     status: 200,
//     //   }
//     // );
//     next()
// };

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
    // const readDirResult = await fs.promises.readdir(input, {recursive: true, encoding: 'utf8'})
    // const readDirResult = await readPagesDir(input);

    // get current url
    // const fileCompiled = await getFile('')
    // console.log(context.request)
    // const routes = await getRoutes();
    // const a = await getFile(context.url.pathname)
    // console.log({routes})
    Log.writeLog('filecompiled','json', context)


    context.locals = await generateLocals(context, input) || {}

    // const locals: Locals = {
    //     currentPage: {
    //         contentHtml: '',
    //         contentRaw: '',
    //         metadata: null
    //     },
    //     routes: routes
    // }



    // const folder = {}
    // for await (const item of readDirResult) {
    //     if (item.endsWith('.md')) {
    //         const content = await fs.promises.readFile(path.join(input, item))
    //         folder[item] = {content: content.toString()}

    //     } else if(item.split('\\').length) {
    //         // it is a folder
    //     }
    // }
    // context.locals = await getFile('');
    // context.locals['routes'] = [];
    next()
})

    //     const folder = {}

    //     for await (const item of dir) {
    //         if (item.endsWith('.md')) {
    //             const content = await fs.promises.readFile(path.join(input, item))
    //             folder[item] = {content: content.toString()}

    //         } else if(item.split('\\').length) {
    //             // it is a folder
    //         }
    //     }
        
    //     // console.log(folder)
    //     context.locals['folder'] = folder
    //     next()
    // })
    
    // ir a buscar las paginas y leer directorio en base al config input
    // console.log(input)


    
    
    
    // console.log({localsMiddlewareAstro: context.locals} )
    // console.log(context.url.searchParams.get('text'))
    // const text = context.url.searchParams.get('text') || ''

    // context.locals.text = text

export const onRequest = middleware;
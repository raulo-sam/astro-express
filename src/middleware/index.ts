// import type { MiddlewareResponseHandler } from "astro";
import { defineMiddleware } from "astro/middleware";
import fs from 'fs'
import path from 'path'
import {readConfigFile} from "./middleware-utils"


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

const middleware = defineMiddleware(async(context, next) => {
    const { input } = await readConfigFile()
    const readDirResult = await fs.promises.readdir(input, {recursive: true, encoding: 'utf8'})
    const folder = {}
    for await (const item of readDirResult) {
        if (item.endsWith('.md')) {
            const content = await fs.promises.readFile(path.join(input, item))
            folder[item] = {content: content.toString()}

        } else if(item.split('\\').length) {
            // it is a folder
        }
    }
    
    // console.log(folder)
    context.locals['folder'] = folder
    console.log(folder)
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
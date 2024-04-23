// import type { MiddlewareResponseHandler } from "astro";
import { defineMiddleware } from "astro/middleware";
import fs from 'fs'


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

const middleware = defineMiddleware(async(context, next, a, b) => {
    console.log("MIDDLEWARE");
    // console.log(context.url.searchParams.get('text'))
    // const text = context.url.searchParams.get('text') || ''

    // context.locals.text = text
    console.log({localsMiddlewareAstro: context.locals} )
    next()
})

export const onRequest = middleware;
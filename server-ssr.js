
import express from 'express'
import {handler as ssrHandler} from './dist/server/entry.mjs'
const app = express()

// app.post('/test', (req, res) => {
//     res.json({
//         test: 'test'
//     })
// })

// app.get('/get', (req, res) => {
//     res.json({
//         test: 'test'
//     })
// })
// app.use(express.static('dist/client/'));


// Modifica esto en función de la opción `base` de tu archivo astro.config.mjs.
// Deben coincidir. El valor predeterminado es "/".
const base = '/'

// app.use(ssrHandler);
app.use(express.static('dist/client'));
app.use(async (req, res, next) => {
    console.log('re')
    ssrHandler(req, res, next)
    // console.log(req.headers)
    // astroServer.handler(req, res, next)
    // astroServer.startServer()

    // const server = astroServer.startServer()

})
app.listen(8080, ()=>{
    console.log('server listen on port: 8080 ', )
})
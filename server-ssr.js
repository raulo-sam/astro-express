// const express = require('express')

import express from 'express'
import {handler as ssrHandler} from './dist/server/entry.mjs'
import fs from 'fs'

const app = express()



app.post('/test', (req, res) => {
    res.json({
        test: 'test'
    })
})

app.get('/get', (req, res) => {
    res.json({
        test: 'test'
    })
})
app.use(express.static('dist/client/'));
app.use( async (req, res, next) => {
    let content = ''
    await fs.promises.readdir('pages').then(files => {
        files.forEach( async file => {
            await fs.promises.readFile(`pages/${file}`).then(data =>{
                content = data.toString()
                if(ssrHandler) {
                    ssrHandler(req, res, next, {props: {content}})
                }
            })
        })
    })
    console.log({content})
})

app.listen(8080, ()=>{
    console.log('server listen on port: 8080 ', )
})
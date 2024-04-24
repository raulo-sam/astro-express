
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
// app.use(express.static('dist/client/'));





app.use( async (req, res, next) => {
    console.log(req.url)
    // const fileTest = await fs.promises.readFile('pages/intro/intro.md')
    // console.log({fileTest: fileTest.toString()})
    // const compiler = await M.createMarkdownProcessor({})
    // const result = await compiler.render(fileTest.toString(), {frontmatter: {title: 'test frontmatter injection'}})
    // console.log(result)
    
    ssrHandler(req, res, next)


    return 
    let content = ''
    await fs.promises.readdir('pages').then(files => {
        files.forEach( async file => {
            await fs.promises.readFile(`pages/${file}`).then(data =>{
                content = data.toString()
                if(ssrHandler) {
                }
            })
        })
    })
    // console.log({content})
})

app.listen(8080, ()=>{
    console.log('server listen on port: 8080 ', )
})
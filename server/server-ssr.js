import express from 'express'
import path from 'path'
import fs from 'fs'
import {createServer as createViteServer} from 'vite'
import SSR from './server-utils.js'

// const express = require('express');
// const fs = require('fs-extra');
// const path = require('path');
// const createViteServer = require('vite').createServer
// const { fileURLToPath } = require('url');
// const SSR = require('./server-utils')


const port = process.env.PORT || 8000
const base = process.env.BASE || '/'
async function createServer() {
  console.log('inicia servidor')
  const app = express();
  const vite = await createViteServer({
    appType: 'custom',
    base,
    server: {
      middlewareMode: true,
    }
  })
  app.use(vite.middlewares)
  app.use(express.static(path.join(SSR.dir, 'public')));
  app.use('*', async (req, res) => {
    let pathName = req.originalUrl.replace('/','')
    
    try {
      if(!SSR.indexTemplate) {
        SSR.indexTemplate = await SSR.getDevIndexTemplate()
      }
      if(!SSR.config) {
        SSR.config = await SSR.readConfigFile()
      }
      const indexTemplateTransformed = await vite.transformIndexHtml(pathName, SSR.indexTemplate)
      const { Renderer } = await vite.ssrLoadModule('/src/entry-server.jsx')
      if(!SSR.pages) {
        SSR.pages = await SSR.getPagesAsync(SSR.config)
      }
      const rendererInstance = new Renderer(indexTemplateTransformed, SSR.pages)
      if(!SSR.pages[pathName]) {
        res.redirect(SSR.pages['index']?.routePath || '/404')
        return;
      }
      const { status, type, body } = rendererInstance.render(pathName)
      res.status(status).set({'Content-Type': type}).end(body)
    } catch (e) {
      vite.ssrFixStacktrace(e)
      console.error(e)
      res.status(500).end(e.message)
    }
  })
  app.listen(port, () => {
    console.log(process.env.NODE_ENV)
    console.log()
      console.log(`Vite Dev Server started at http://localhost:${port}`)
  })
}



// export async function getPagesAsync(config) {
//   const input = config?.input || './pages'
//   let pages = {}
//   let routes = []
//   try {
//     routes = await fs.promises.readdir(input, {recursive: true})
//     const promises = routes.filter(i=>i.endsWith('.md')).map(i=> setPage(i))
//     await Promise.all([...promises]).then(values => {
//       const length = values.length
//       const val1 = values[0]
//       for (let i=0; i < values.length; i++){
//         const page = values[i]
//         const key = Object.keys(page)[0]
//         pages[key] = page[key]
//       }
//     })
//     return pages
//     // routes = routes.filter(item => item.endsWith('.md')).map(item=> item.replace('.md','').replace(/\\/g, '/')) || []
//   } catch(e) {
//     console.error(e)
//   }


// }
// export function setPage(path) {
//   return new Promise( async (res, rej) => {
//     try {
//       const fileRaw = await fs.promises.readFile('pages/' + path, {encoding: 'utf-8'})
//       const compiler = await M.createMarkdownProcessor({})
//       const result = await compiler.render(fileRaw.toString(), {frontmatter: {title: 'test frontmatter injection'}})
//       const normalizePath = path.replace('.md','').split(sep).join('/')
//       res({
//         [normalizePath]: {
//           routePath: normalizePath,
//           filePath: path.split(sep).join('/'),
//           contentHtml: result.code,
//           contentRaw: fileRaw.toString(),
//           metadata: {
//               headings: result.metadata.headings,
//               imagesPaths: result.metadata.imagePaths,
//               frontmatter: result.metadata.frontmatter
//           }
//         }
//       }
//         )
//     } catch(e) {
//       rej(e)
//     }
//   })
// }

createServer()
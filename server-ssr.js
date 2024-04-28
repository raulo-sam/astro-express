import fs from 'fs'
import path, { dirname, resolve , sep} from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import { createServer as createViteServer } from 'vite'
import {read} from "node-yaml"
import * as M from '@astrojs/markdown-remark'

export let pages
let indexTemplate
let config


const dir = dirname(fileURLToPath(import.meta.url))
const port = process.env.PORT || 8000
const base = process.env.BASE || '/'
async function createServer() {
  const app = express();
  const vite = await createViteServer({
    appType: 'custom',
    base,
    server: {
      middlewareMode: true,
    }
  })
  app.use(vite.middlewares)
  app.use('*', async (req, res) => {
    // const { pathname } = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`)
    const pathName = req.originalUrl.replace('/','')
    try {
      if(!indexTemplate) {
        indexTemplate = await fs.promises.readFile(resolve(dir, 'index.html'), {encoding: 'utf-8'})
      }
      if(!config) {
        config = await readConfigFile()
      }
      const indexTemplateTransformed = await vite.transformIndexHtml(pathName, indexTemplate)
      const { Renderer } = await vite.ssrLoadModule('/src/entry-server.jsx')
      if(!pages) {
        pages = await getPagesAsync(config)
      }
      const rendererInstance = new Renderer(indexTemplateTransformed, pages)
      console.log({pages})
      console.log(pathName)
      if(pages[pathName]) {
        const { status, type, body } = rendererInstance.render(pathName)
        res.status(status).set({'Content-Type': type}).end(body)
        return
      }
      res.status(200).send()
    } catch (e) {
      vite.ssrFixStacktrace(e)
      console.error(e)
      res.status(500).end(e.message)
    }
  })
  app.listen(port, () => {
      console.log(`Vite Dev Server started at http://localhost:${port}`)
  })
}

const readConfigFile = async () =>   {
  return new Promise((resolve, reject) => {
      return read('roc-doc.yml').then(config => {
          // here some validations
          if(config?.input) {
              resolve(config)
          } else {
              reject('roc-doc.yml should contains input property')
          }
      }).catch(err => {
          reject(err)
      }) 
  })
}


export async function getPagesAsync(config) {
  const input = config?.input || './pages'
  let pages = {}
  let routes = []
  try {
    routes = await fs.promises.readdir(input, {recursive: true})
    const promises = routes.filter(i=>i.endsWith('.md')).map(i=> setPage(i))
    await Promise.all([...promises]).then(values => {
      const length = values.length
      const val1 = values[0]
      for (let i=0; i < values.length; i++){
        const page = values[i]
        const key = Object.keys(page)[0]
        pages[key] = page[key]
      }
    })
    return pages
    // routes = routes.filter(item => item.endsWith('.md')).map(item=> item.replace('.md','').replace(/\\/g, '/')) || []
  } catch(e) {
    console.error(e)
  }


}
function setPage(path) {
  return new Promise( async (res, rej) => {
    try {
      const fileRaw = await fs.promises.readFile('pages/' + path, {encoding: 'utf-8'})
      const compiler = await M.createMarkdownProcessor({})
      const result = await compiler.render(fileRaw.toString(), {frontmatter: {title: 'test frontmatter injection'}})
      const normalizePath = path.replace('.md','').split(sep).join('/')
      res({
        [normalizePath]: {
          filePath: path.split(sep).join('/'),
          contentHtml: result.code,
          contentRaw: fileRaw.toString(),
          metadata: {
              headings: result.metadata.headings,
              imagesPaths: result.metadata.imagePaths,
              frontmatter: result.metadata.frontmatter
          }
        }
      }
        )
    } catch(e) {
      rej(e)
    }
  })
}


createServer()
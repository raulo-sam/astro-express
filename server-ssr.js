import fs from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import { createServer as createViteServer } from 'vite'
import {read} from "node-yaml"
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
    const { pathname } = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`)
    try {
      const indexTemplate = await fs.promises.readFile(resolve(dir, 'index.html'), {encoding: 'utf-8'})
      const config = await readConfigFile()
      console.log(config)
      console.log({indexTemplate})
      const indexTemplateTransformed = await vite.transformIndexHtml(pathname, indexTemplate)
      console.log({indexTemplateTransformed})
      const { Renderer } = await vite.ssrLoadModule('/src/entry-server.tsx')
      const rendererInstance = new Renderer(indexTemplateTransformed, config)
      const { status, type, body } = rendererInstance.render(pathname)
      res.status(status).set({'Content-Type': type}).end(body)
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
createServer()
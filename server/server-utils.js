import * as M from '@astrojs/markdown-remark'
import fs from 'fs'
import fse from 'fs-extra'
import {read} from "node-yaml"
import {dirname, resolve, sep, } from 'path'
import {fileURLToPath} from 'url'

// const filename__ = fileURLToPath(import.meta.url);
// const dirname__ = dirname(filename__);
console.log(resolve(process.cwd()))
const dirname__ = process.cwd()

const serverUtils = {
  outDirClient: 'dist/client',
  outDirServer: 'dist/server',
  pages: {},
  config: {},
  indexTemplate: '',
  dir: resolve(dirname__),
  readConfigFile: async () => {
    return new Promise((resolve, reject) => {
      return read('roc-doc.yml').then(config => {
          // here some validations
          if(config?.input) {
            serverUtils.config = config
              resolve(config)
          } else {
              reject('roc-doc.yml should contains input property')
          }
      }).catch(err => {
          reject(err)
    }) 
    })
  },
  getPagesAsync: async (config) => {
    const input = config?.input || '/pages'
    let pages = {}
    let routes = []
    try {
      routes = await fs.promises.readdir(input, {recursive: true})
      console.log({routes})
      const promises = routes.filter(i=>i.endsWith('.md')).map(i=> serverUtils.setPage(i))
      await Promise.all([...promises]).then(values => {
        for (let i=0; i < values.length; i++){
          const page = values[i]
          const key = Object.keys(page)[0]
          pages[key] = page[key]
        }
      })
      serverUtils.pages = pages
      return pages
      // routes = routes.filter(item => item.endsWith('.md')).map(item=> item.replace('.md','').replace(/\\/g, '/')) || []
    } catch(e) {
      console.error(e)
    }
  },
  setPage: (pathname) => {
    return new Promise( async (res, rej) => {
      try {
        const fileRaw = await fs.promises.readFile('pages/' + pathname, {encoding: 'utf-8'})
        const compiler = await M.createMarkdownProcessor({})
        const result = await compiler.render(fileRaw.toString(), {frontmatter: {title: 'test frontmatter injection'}})
        const normalizePath = pathname.replace('.md','').split(sep).join('/')
        res({
          [normalizePath]: {
            routePath: normalizePath,
            filePath: pathname.split(sep).join('/'),
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
  },
  getDevIndexTemplate: () => {
    console.log(resolve(serverUtils.dir, 'index.html'))
    return fs.promises.readFile(resolve(serverUtils.dir, 'index.html'), {encoding: 'utf-8'})
  },
  getProdIndexTemplate: () => {
    return fse.readFileSync(resolve(serverUtils.dir, 'dist/client/index.html'), {encoding: 'utf-8'})
  }
}
 
export default serverUtils
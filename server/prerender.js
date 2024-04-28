import fse from 'fs-extra'
import {resolve} from 'path'
import SSR from './server-utils.js'

async function prerender() {
  try {
    const { Renderer } = await import('../dist/server/entry-server.js')
    const config = await SSR.readConfigFile()
    SSR.pages = await SSR.getPagesAsync(config) || {}
    const renderer = new Renderer(SSR.getProdIndexTemplate(), SSR.pages)
    Object.entries(SSR.pages).forEach(([pathname, page]) => {
      const { body } = renderer.render(pathname) || {}
      const filePath = `dist/client/${page.routePath}.html`
      fse.outputFileSync(resolve(SSR.dir, filePath), body)
      console.log('🖨   Prerendered', filePath)
    })
    // Object.entries(renderer.feeds).forEach(([pathname, feed]) => {
    //   const body = feed(renderer.pages)
    //   const filePath = `dist/static${pathname}`
    //   fse.outputFileSync(resolve(dir, filePath), body)
    //   console.log('🖨   Prerendered', filePath)
    // })
    console.log('🦖  Your static site is ready to deploy from dist/static')

    // const pkg = JSON.parse(await fse.readFile(resolve(SSR.dir, './package.json')))
    // if (pkg?.tropical?.siteHost === 'https://www.example.org') {
    //   console.log(
    //     `⚠️   Configure tropical.siteHost in package.json, otherwise links in your JSON Feed won't work!`
    //   )
    // }
  } catch (e) {
    console.error(e)
  }
}

prerender()

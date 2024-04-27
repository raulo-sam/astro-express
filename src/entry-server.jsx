import javascriptLogo from './javascript.svg'
import ReactDOMServer from 'react-dom/server'
import TitleComponent from './title'
import React from "react"

// export function render() {
//   const html = `
//     <div>
//       <a href="https://vitejs.dev" target="_blank">
//         <img src="/vite.svg" class="logo" alt="Vite logo" />
//       </a>
//       <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//         <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//       </a>
//       <h1>Hello Vite!</h1>
//       <div class="card">
//         <button id="counter" type="button"></button>
//       </div>
//       <p class="read-the-docs">
//         Click on the Vite logo to learn more
//       </p>
//     </div>
//   `
//   return { html }
// }


export class Renderer {
  pages = null
  // feeds = null
  transformedTemplate = null

  constructor(transformedTemplate) {
    this.pages = gatherPages()
    console.log({pages: this.pages})
    // this.feeds = gatherFeeds()
    this.transformedTemplate = transformedTemplate
  }

  render(pathname) {
    return this.renderPage(pathname)
  }


  renderPage(pathname) {
    if (!pathname.endsWith('/')) pathname = `${pathname}/`

    const html = ReactDOMServer.renderToString(
      <>
        <TitleComponent></TitleComponent>
        <p>description</p>
      </>
    )

    console.log(pathname)
    console.log({htmlReact: html})

    return {
      status: 200,
      type: 'text/html',
      body: this.transformedTemplate
        // .replace('<!--react-head-outlet-->', ReactDOMServer.renderToStaticMarkup(headTags))
        // .replace('<!--fela-outlet-->', renderToMarkup(felaRenderer))
        .replace('<!--app-html-->', html)
    }
    // return {
    //   status: this.pages[pathname] ? 200 : 404,
    //   type: 'text/html',
    //   body: this.transformedTemplate
    //     .replace('<!--react-head-outlet-->', ReactDOMServer.renderToStaticMarkup(headTags))
    //     .replace('<!--fela-outlet-->', renderToMarkup(felaRenderer))
    //     .replace('<!--body-outlet-->', html)
    // }
  }


  
}

function gatherPages() {

  return [{
    body: `<h1> hola prerender </h1>` ,
    filePath: '/test/pepito'
  }]
  // const modules = import.meta.glob('./pages/**/*.md')
  // console.log({modules})
  // // Object.entries(modules).forEach(async (m) => {
  // //   console.log(m)
  // // })
  
  // for (const item in modules) {
  //   const m = modules[item]
  //   console.log({m: m()})
  // }




  // return Object.entries(modules).reduce((pages, [modulePath, page]) => {
  //   const filePath = modulePath.replace(/^\.\/pages/, '').replace(/(\.jsx|\.mdx)$/, '')
  //   const urlPath = filePath.endsWith('/index') ? filePath.replace(/index$/, '') : `${filePath}/`
  //   console.log({modulePath, page: page})
  //   pages[urlPath] = {
  //     Component: page.default,
  //     meta: page.meta,
  //     tableOfContents: page.tableOfContents,
  //     filePath,
  //     modulePath,
  //     urlPath
  //   }
  //   return pages
  // }, {})
}

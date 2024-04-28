import ReactDOMServer from 'react-dom/server'
import TitleComponent from './title'
export class Renderer {
  pages = null
  // feeds = null
  transformedTemplate = null

  constructor(transformedTemplate, pages) {
    this.pages = pages
    this.transformedTemplate = transformedTemplate
    if (typeof Renderer.instance === Object) {
      return Renderer.instance
    }
    Renderer.instance = this
    return this
  }

  render(pathname) {
    return this.renderPage(pathname)
  }


  renderPage(pathname) {
    console.log({pathname})
    if(!this.pages[pathname]) return
    const html = ReactDOMServer.renderToString(
      <>
        <TitleComponent></TitleComponent>
        pages
        <p>description</p>
        <div dangerouslySetInnerHTML={{ __html: this.pages[pathname]?.contentHtml }} />
      </>
    )

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



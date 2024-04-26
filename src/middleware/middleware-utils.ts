import fs from 'fs'
import {read} from "node-yaml"
import * as M from '@astrojs/markdown-remark'
import path from 'path'
import type { Locals } from '.'
import type { APIContext } from 'astro'

export interface rocdocConfig {
    input: string
}
export const readConfigFile = (): Promise<rocdocConfig> =>   {
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

export async function getFile(url: string): Promise<Locals> {
    // console.log({urlGetfile: url})
    const fileRaw = await fs.promises.readFile(url)
    const compiler = await M.createMarkdownProcessor({})
    console.log(fileRaw)
    const result = await compiler.render(fileRaw.toString(), {frontmatter: {title: 'test frontmatter injection'}})
    return Promise.resolve({
        currentPage: {
            contentHtml: result.code,
            contentRaw: fileRaw.toString(),
            metadata: {
                headings: result.metadata.headings,
                imagesPaths: result.metadata.imagePaths,
                frontmatter: result.metadata.frontmatter
            }
        },
        routes: []
    })
}


export async function generateLocalsByConfig(context: APIContext, input: string): Promise<Locals> {
// generar las rutas

    let routes: string[] = []
    let locals: Locals = getLocalsByDefault();
    try {
        // 1. solo las rutas que acaban en .md añadirlas al array
        routes = await fs.promises.readdir(input, {recursive: true})
        routes = routes.filter(item => item.endsWith('.md')).map(item=> item.replace('.md','').replace(/\\/g, '/')) || []
        const url = context.url.pathname.replace('/','')
        let file = ''
        // 2. averiguar la ruta actual
        console.log(routes)
        console.log({url})
        if(routes.some(route => url === route)) {
            // console.log(routes)
            // console.log({url})
            // aqui traer el archivo
            console.log('es misma ruta')
            locals = await getFile(`${input}/${url}.md`)
            console.log(locals)
        } else if(url === '/') {
            // aqui ir llamar el archivo home or index.md
            console.log('es home')
            locals = await getFile(`${input}/home.md`)
            
        } else {
            console.log('es distinto')
            
        }
        
        locals.routes = routes;
        return Promise.resolve(locals)
    } catch(err) {
        console.error(err)
    }


}

function getLocalsByDefault(): Locals {
    return {
        currentPage: {
            contentHtml: '<p>error</>',
            contentRaw: '',
            metadata: null
        },
        routes: ['/error']
    }
}


export async function generateStaticPaths() {
    const {input} = await readConfigFile()
    let pages: {params: {slug: string}, props: {input}}[] = []
    let routes = []
    routes = await fs.promises.readdir(input, {recursive: true})
    routes = routes.filter(item => item.endsWith('.md')).map(item=> item.replace('.md','').replace(/\\/g, '/')) || []
    pages = routes.map(route => ({
        params: {slug: route},
        props: {input}
    }))
    return Promise.resolve(pages);
}


export class Log {
    static writeLog(filename: string, extension: string, data: any) {
        fs.writeFileSync(`log/${filename}.${extension}`, JSON.stringify(data));
    }
}
import fs from 'fs'
import {read} from "node-yaml"

export const readConfigFile = (): Promise<any> =>   {
    return new Promise((resolve, reject) => {
        return read('roc-doc.yml').then(config => {
            // here some validations
            if(checkConfigFile(config)) {
                resolve(config)
            } else {
                reject('roc-doc.yml should contains input property')
            }
        }).catch(err => {
            reject(err)
        }) 
    })
}

function checkConfigFile(config: any): boolean {
    return config.input ? true : false
}
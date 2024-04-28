import express from 'express'
import fse from 'fs-extra'
import path, {dirname} from 'path'
import { fileURLToPath } from 'url'
const app = express()
// const dir = dirname(fileURLToPath(import.meta.url))
app.use(express.static('dist/client'));
app.use((req, res) => {
    const i = path.join('..', 'dist/client/' + req.path + '.html')
    console.log(i)
    if(fse.pathExistsSync(i)) {
        console.log({i})
        res.sendFile(i)
    } else {
        res.redirect('/')
    }
});
app.listen(8080, ()=>{
    console.log('server listen on port: https://localhost:8080 ', )
})
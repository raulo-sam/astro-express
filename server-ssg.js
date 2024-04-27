import express from 'express'
const app = express()
app.use(express.static('dist/client'));
app.listen(8080, ()=>{
    console.log('server listen on port: https://localhost:8080 ', )
})
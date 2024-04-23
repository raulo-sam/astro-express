// const express = require('express')

import express from 'express'
const app = express()
app.use(express.static('dist/'));
app.listen(8080, ()=>{
    console.log('server listen on port: 8080 ', )
})
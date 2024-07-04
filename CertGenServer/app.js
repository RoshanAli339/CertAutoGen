const express = require('express')
const multer = require('multer')
const cors = require('cors')
const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 5000

const uploads = multer({dest: 'uploads/'})

app.use(cors)
app.get('/', (req, res)=>{
    res.send("Hello World")
})

app.post('/api/upload', (req, res)=>{
    console.log(req.body);
    console.log(req.files)
    res.json({status: "Files Received"})
})

app.listen(PORT, ()=>{
    console.log("Server is running on port " + PORT)
})
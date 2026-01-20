const express = require('express')
const app  = express ()
const mongoose = require('mongoose')
require('dotenv').config()

//TO GET DATA IN JSON FILE FORMAT
app.use(express.json())

//TO GET DATA IN FROM FORMAT
app.use(express.urlencoded({extended: false}))


app.get('/', (req, res)=>{
    res.send("This is homepage")
})

//

mongoose.connect(
process.env.DATABASE_URL    
).
then(()=>{
    console.log("Connected to Database")
    app.listen(5000, ()=>{
        console.log("app is listening to port 5000")
    })
}).catch((err)=>{
    console.log("Unable to Connect to database")
})
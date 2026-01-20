const express = require('express')
const app  = express ()
const mongoose = require('mongoose')
require('dotenv').config()

const user = require('./models/user_schema.js')

//TO GET DATA IN JSON FILE FORMAT
app.use(express.json())

//TO GET DATA IN FROM FORMAT
app.use(express.urlencoded({extended: false}))


app.get('/', (req, res)=>{
    res.send("This is homepage")
})

//ADD NEW USER 
app.post('/user/api', async (req, res)=>{
   try {
     const adduser = await user.create(req.body)
     if(!adduser){
         return res.status(400).json({successfull: false, data: "Unable To add User "})

     }
     return res.status(200).json({succesfull: true, data: adduser})
   } catch (error) {
    res.status(400).json({succesfull: false, data: error.getMessage})
   }
})

//GET ALL USER
app.get('/user/api', async(req, res)=>{
    try{
        const getUser = await user.find({})
        if(!getUser){
            return res.status(400).json({successfull: false, data: "Unable To get User "})
        }
        return res.status(200).json({successfull: true, data: getUser})
    }catch(error){
        res.status(400).json({succesfull: false, data: error.getMessage})
    }
})
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
const express = require('express')

const {deleteUser, addUser, updateUser, getUserById, getAllUser, loginUser, refreshToken} = require('../controller/user_controller.js')

const userRoute = express.Router()

//LOGIN USER
userRoute.post('/login',loginUser )

//REFRESH TOKEN
userRoute.post('/refresh', refreshToken )

//ADD NEW USER
userRoute.post("/", addUser );

//GET ALL USER
userRoute.get("/", getAllUser);

//UPDATE USER
userRoute.put("/:id", updateUser);

//GET USER BY ID
userRoute.get("/:id", getUserById );

//DELETE USER 
userRoute.delete("/:id", deleteUser )

module.exports = userRoute
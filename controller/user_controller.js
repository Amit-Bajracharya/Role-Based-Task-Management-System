const User = require('../models/user_schema.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const loginUser = async (req, res)=>{
  try{
    const {email, password} = req.body

    if(!email || !password){
      return res.status(401).json({success: false, data: "Please enter Email and Password"})
    }

    const user = await User.findOne({email})
    if(!user){
      return res.status(401).json({success: false, data: "Unable to find the email"})
    }

    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
      return res.status(401).json({success: false, data: "Password is incorrect"})
    }

    const payload ={
      userId: user._id,
      email: user.email,
      role: user.role
    }

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn:'15m'})
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn:'7d'})

    // Save refresh token to database
    await User.findByIdAndUpdate(user._id, { refreshToken: refreshToken }) // fixed variable name conflict

        const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }
    
    res.status(200).json({ 
      success: true, 
      data: {
        user: userResponse,
        token: accessToken,
        refreshToken: refreshToken
      }
    })
  }catch(err){
    res.status(400).json({ success: false, data: err.message })
  }
}
const getAllUser = async (req, res)=>{
     try {
    const getUser = await User.find({});
    if (getUser.length === 0) {
      return res
        .status(400)
        .json({ succes: false, data: "Unable To get User " });
    }
    return res.status(201).json({ succes: true, data: getUser });
  } catch (error) {
    res.status(400).json({ succes: false, data: error.message });
  }
}

const getUserById = async(req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ succes: false, data: "Unable to find id " });
    }
    const fetchedData = await User.findById(id)
    if(!fetchedData){
         return res
        .status(400)
        .json({ succes: false, data: "Unable to find Data " });
    }
    return res.status(201).json({succes: true, data: fetchedData});
  } catch (error) {
    res.status(400).json({ succes: false, data: error.message });
  }
}

const addUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const userData = {
      username: req.body.username,
      email : req.body.email,
      password : hashedPassword,
      role: req.body.role
    }
    const adduser = await User.create(userData);
    if (!adduser) {
      return res
        .status(400)
        .json({ succes: false, data: "Unable To add User " });
    }
    return res.status(201).json({ succes: true, data: adduser });
  } catch (error) {
    res.status(400).json({ succes: false, data: error.message });
  }
}


const updateUser =  async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ succes: false, data: "Unable to find id " });
    }
    if(req.body.password){
      req.body.password = await bcrypt.hash(req.body.password, 10)
    }
    const userData = await User.findByIdAndUpdate(id, req.body);

    if (!userData) {
      return res
        .status(400)
        .json({ succes: false, data: "Unable to Update the id " });
    }

    const updatedUser = await User.findById(id);
    return res.status(201).json({ succes: true, data: updatedUser });
  } catch (error) {
    res.status(400).json({ succes: false, data: error.message });
  }
}

const deleteUser = async (req, res)=>{
 try{
    const {id} = req.params;
    if(!id){
        return res
        .status(400)
        .json({ succes: false, data: "Unable to find id " });
    }

    const deleteUser = await User.findByIdAndDelete(id)
    if(!deleteUser){
        return res.status(400).json({succes: false, data: "Unable to Delete User"})
    }
    return res.status(201).json({succes: true, data: "User Deleted succesy"})
 }catch(error){
     res.status(400).json({ succes: false, data: error.message });
 }
}

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body
  
  if (!refreshToken) {
    return res.status(401).json({ success: false, data: 'No refresh token' })
  }
  
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY)
    const userFound = await User.findById(decoded.userId)
    
    if (!userFound || userFound.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, data: 'Invalid refresh token' })
    }
    
    // Generate new access token
    const payload = {
      userId: userFound._id,
      email: userFound.email,
      role: userFound.role
    }
    
    const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '15m' })
    
    res.status(200).json({ 
      success: true, 
      data: { token: newAccessToken }
    })
  } catch (error) {
    res.status(401).json({ success: false, data: 'Invalid refresh token' })
  }
}

module.exports = {deleteUser, addUser, updateUser, getUserById, getAllUser, loginUser, refreshToken}
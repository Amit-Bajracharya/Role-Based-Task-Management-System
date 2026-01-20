const user = require('../models/user_schema.js')

const getAllUser = async (req, res)=>{
     try {
    const getUser = await user.find({});
    if (!getUser) {
      return res
        .status(400)
        .json({ successfull: false, data: "Unable To get User " });
    }
    return res.status(200).json({ successfull: true, data: getUser });
  } catch (error) {
    res.status(400).json({ succesfull: false, data: error.getMessage });
  }
}

const getUserById = async(req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ succesfull: false, data: "Unable to find id " });
    }
    const fetchedData = await user.findById(id)
    if(!fetchedData){
         return res
        .status(400)
        .json({ succesfull: false, data: "Unable to find Data " });
    }
    return res.status(200).json({succesfull: true, data: fetchedData});
  } catch (error) {
    res.status(400).json({ succesfull: false, data: error.getMessage });
  }
}

const addUser = async (req, res) => {
  try {
    const adduser = await user.create(req.body);
    if (!adduser) {
      return res
        .status(400)
        .json({ successfull: false, data: "Unable To add User " });
    }
    return res.status(200).json({ succesfull: true, data: adduser });
  } catch (error) {
    res.status(400).json({ succesfull: false, data: error.getMessage });
  }
}


const updateUser =  async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ succesfull: false, data: "Unable to find id " });
    }
    const userData = await user.findByIdAndUpdate(id, req.body);

    if (!userData) {
      return res
        .status(400)
        .json({ succesfull: false, data: "Unable to Update the id " });
    }

    const updatedUser = await user.findById(id);
    return res.status(200).json({ successfull: true, data: updatedUser });
  } catch (error) {
    res.status(400).json({ succesfull: false, data: error.getMessage });
  }
}

const deleteUser = async (req, res)=>{
 try{
    const {id} = req.params;
    if(!id){
        return res
        .status(400)
        .json({ succesfull: false, data: "Unable to find id " });
    }

    const deleteUser = await user.findByIdAndDelete(id)
    if(!deleteUser){
        return res.status(400).json({succesfull: false, data: "Unable to Delete User"})
    }
    return res.status(200).json({succesfull: true, data: "User Deleted Succesfully"})
 }catch(error){
     res.status(400).json({ succesfull: false, data: error.getMessage });
 }
}

module.exports = {deleteUser, addUser, updateUser, getUserById, getAllUser}
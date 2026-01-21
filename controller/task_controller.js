const task = require('../models/task_schema.js')

const addTask =async (req, res)=>{
  const addedTask = await task.create({...req.body, userId: req.user.userId})
  try {
    if(!addedTask){
      return res.status(400).json({sucess: false, data: "Unable to add task"})
    }
    return res.status(201).json({sucess: true, data: addedTask})
  } catch (error) {
    res.status(400).json({sucess: false, data: error.message})
  }
}

const updateTask = async(req, res)=>{
 try {
   const {id} = req.params;
   if(!id){
     return res.status(400).json({sucess: false, data: "Unable to find the required id"})
   }
   const updateTask = await task.findOneAndUpdate({userId: req.user.userId, _id: id}, req.body)
   if(!updateTask){
     return res.status(400).json({sucess: false, data: "Unable to update the task"})
   }
   const updatedTask = await task.findById(id)
   return res.status(201).json({sucess: true, data: updatedTask})
 } catch (error) {
    res.status(400).json({sucess: false, data: error.message})
 }
}

const getTask = async(req, res)=>{
  const fetchTask = await task.find({userId: req.user.userId})
  try {
    if(!fetchTask){
       return res.status(400).json({sucess: false, data: "Unable to find task"})
    }
    return res.status(201).json({sucess: true, data: fetchTask})
  } catch (error) {
     res.status(400).json({sucess: false, data: error.message})
  }
}

const getTaskById = async(req, res)=>{
  try{
    const {id} = req.params
    const fetchTaskById = await task.findById(id)
    if(!fetchTaskById){
        return res.status(400).json({sucess: false, data: `Unable to find the task with id  ${id}`})
    }
    return res.status(201).json({sucess: true, data: fetchTaskById})
  }catch(error){
    res.status(400).json({sucess: false, data: error.message})
  }
}

const deleteTask = async(req, res)=>{
try{
  const {id} = req.params
  const deleteTask = await task.findOneAndDelete({userId: req.user.userId, _id: id})
  if(!deleteTask){
    return res.status(400).json({sucess: false, data: "Unable to delete the task"})
  }
  return res.status(201).json({sucess: true, data: "successfully Deleted The Task"})
}catch(error){
  res.status(400).json({sucess: false, data: error.message})
}
}

module.exports = {addTask, deleteTask, updateTask, getTaskById, getTask}
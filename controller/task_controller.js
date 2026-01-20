const task = require('../models/task_schema.js')

const addTask =async (req, res)=>{
  const addedTask = await task.create(req.body)
  try {
    if(!addedTask){
      return res.status(400).json({succesfull: false, data: "Unable to add task"})
    }
    return res.status(200).json({succesfull: true, data: addedTask})
  } catch (error) {
    res.status(400).json({succesfull: false, data: error.message})
  }
}

const updateTask = async(req, res)=>{
 try {
   const {id} = req.params;
   if(!id){
     return res.status(400).json({succesfull: false, data: "Unable to find the required id"})
   }
   const updateTask = await task.findByIdAndUpdate(id, req.body)
   if(!updateTask){
     return res.status(400).json({succesfull: false, data: "Unable to update the task"})
   }
   const updatedTask = await task.findById(id)
   return res.status(200).json({succesfull: true, data: updatedTask})
 } catch (error) {
    res.status(400).json({succesfull: false, data: error.message})
 }
}

const getTask = async(req, res)=>{
  const fetchTask = await task.find({})
  try {
    if(!fetchTask){
       return res.status(400).json({succesfull: false, data: "Unable to find task"})
    }
    return res.status(200).json({succesfull: true, data: fetchTask})
  } catch (error) {
     res.status(400).json({succesfull: false, data: error.message})
  }
}

const getTaskById = async(req, res)=>{
  try{
    const {id} = req.params
    const fetchTaskById = await task.findById(id)
    if(!fetchTaskById){
        return res.status(400).json({succesfull: false, data: `Unable to find the task with id  ${id}`})
    }
    return res.status(200).json({succesfull: true, data: fetchTaskById})
  }catch(error){
    res.status(400).json({succesfull: false, data: error.message})
  }
}

const deleteTask = async(req, res)=>{
try{
  const {id} = req.params
  const deleteTask = await task.findByIdAndDelete(id)
  if(!deleteTask){
    return res.status(400).json({succesfull: false, data: "Unable to delete the task"})
  }
  return res.status(200).json({succesfull: true, data: "Succesfully Deleted The Task"})
}catch(error){
  res.status(400).json({succesfull: false, data: error.message})
}
}

module.exports = {addTask, deleteTask, updateTask, getTaskById, getTask}
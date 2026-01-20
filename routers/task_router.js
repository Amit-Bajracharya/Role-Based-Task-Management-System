const express = require('express')
const taskRoute = express.Router()
const {addTask, deleteTask, updateTask, getTaskById, getTask} = require('../controller/task_controller.js')

//ADD A NEW TASK 
taskRoute.post('/',addTask)

//VIEW ALL TASKS
taskRoute.get('/',getTask )

//UPDATE TASK 
taskRoute.put('/:id', updateTask)

//DELETE TASKS
taskRoute.delete('/:id', deleteTask)

//GET TASK BY ID
taskRoute.get('/:id',getTaskById )

module.exports = taskRoute
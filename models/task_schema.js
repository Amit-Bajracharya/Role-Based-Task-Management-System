const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, "Please Enter A Title"]
    },
    description:{
        type: String,
        required:[true, "Please Enter The Description"]
    },
    status:{
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending',
        required:[true, "Please the status"]
    },
    priority:{
        type: String,
        enum: ['low', 'medium', 'high'],
        default:'low',
        required:[true, "Please Enter The Priority of The Task"]
    },
    dueDate:{
        type: Date
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
{timestamps: true}
)

const task = mongoose.model("task", taskSchema)

module.exports = task
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const userRoute = require('./routers/user_router.js')
const taskRoute = require("./routers/task_router.js");
const auth = require('./middleware/auth.js')

app.use(express.static('public'))

//TO GET DATA IN JSON FILE FORMAT
app.use(express.json());

//TO GET DATA IN FROM FORMAT
app.use(express.urlencoded({ extended: false }));

//ROUTER FOR USER
app.use('/user/api', userRoute)

app.use('/tasks/api', auth, taskRoute)

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});


mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Connected to Database");
    app.listen(5000, () => {
      console.log("app is listening to port 5000");
    });
  })
  .catch((err) => {
    console.log("Unable to Connect to database");
  });

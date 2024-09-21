let mongoose = require('mongoose')
require('dotenv').config();


mongoose.connect(process.env.MONGO_URI).then((req) => {
    console.log("mongodb databse taskmanagment connected!!!!");
}).catch((err) => {
    console.log("database eroor are show");
})
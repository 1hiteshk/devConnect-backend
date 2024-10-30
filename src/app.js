const express = require('express');
const app = express();
const connectDB = require("./config/database")

connectDB().then(()=>{
    console.log("Database connection established ...");
    app.listen(7777,()=>{
        console.log(`server is successfully listening on port 7777`)
    })
}).catch((err)=>{
    console.error(`Database cannot be connected ${err.message}`)
})
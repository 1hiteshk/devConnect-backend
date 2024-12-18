const express = require('express');
const app = express();
const connectDB = require("./config/database")
const cookieParser = require("cookie-parser")
const cors = require("cors")

app.use(cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS','PUT'],
    credentials: true
}));
// Additional configuration if necessary
app.options('*', cors()); // Allow preflight requests for all routes
app.use(express.json());
app.use(cookieParser());

// Routes
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const userRouter = require('./routes/user');
const requestRouter = require('./routes/request');

app.use('/api', authRouter);
app.use('/api', profileRouter); 
app.use('/api', userRouter);  // This will be used for handling user related requests
app.use('/api', requestRouter); // This will be used for handling request related requests accept ,review

connectDB().then(()=>{
    console.log("Database connection established ...");
    app.listen(7777,()=>{
        console.log(`server is successfully listening on port 7777`)
    })
}).catch((err)=>{
    console.error(`Database cannot be connected ${err.message}`)
}) 
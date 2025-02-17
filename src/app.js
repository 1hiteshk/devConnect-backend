const express = require('express');
const app = express();
require("dotenv").config();
const connectDB = require("./config/database")
const cookieParser = require("cookie-parser")
const cors = require("cors");
const http = require("http");
const socket = require("socket.io"); // Moved here before usage
const initializeSocket = require('./utils/socket');

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
const chatRouter = require('./routes/chat');


app.use('/api', authRouter);
app.use('/api', profileRouter); 
app.use('/api', userRouter);  // This will be used for handling user related requests
app.use('/api', requestRouter); // This will be used for handling request related requests accept ,review
app.use('/api', chatRouter); // This will be used for handling chat related requests

const server = http.createServer(app); // we need this http server for socket.io configuration
initializeSocket(server);

connectDB().then(()=>{
    console.log("Database connection established ...");
    server.listen(process.env.PORT,()=>{
        console.log(`server is successfully listening on port 7777`)
    })
}).catch((err)=>{
    console.error(`Database cannot be connected ${err.message}`)
}) 
const express = require('express');
const userRouter = express.Router();

const {userAuth} = require('../middlewares/auth')
const User = require('../models/user');
const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");

const {validateSignUpData} = require("../utils/validation")
const User = require("../models/user")

authRouter.post("/signup" , async(req,res)=> {
    try{
        //validation of data
        validateSignUpData(req);

        const{firstName,lastName,emailId,password} = req.body;

        //Encrypt the password
        const passwordHash = await bcrypt.hash(password,10);
        console.log({password})

        //creating a new instance of the user model
        const user = new User({firstName,lastName,emailId,password:passwordHash});

        const savedUser = await user.save();
        const token = await savedUser.getJWT();

        res.cookie("token",token,{
            expires: new Date(Date.now() + 8 * 3600000)
        });

        res.json({message:"User Added Successfully!", data:savedUser})
    }
    catch(err){
        res.status(400).send(`Error : ${err.message}`)
    }
});

authRouter.post("/login", async(req,res)=>{
    try {
        const {emailId, password} = req.body;

        const user = await User.findOne({emailId:emailId});
        
        if(!user){
            throw new Error("Invalid Credentials")
           // return res.status(400).send("Invalid email or password");
        }

        const isPasswordValid = await user.validatePassword(password);

        if(isPasswordValid){
            const token  = await user.getJWT();

            res.cookie('token', token , {
                expires: new Date(Date.now() + 8 * 3600000)
            });
            res.send(user);
        } else{
            throw new Error("Invalid Credentials")
        }
    } catch (error) {
        res.status(400).send(`ERROR : ${error.message}`)
    }
});

authRouter.post("/logout", async(req,res)=>{
    res.cookie("token",null , {
        expires: new Date(Date.now())
    });
    res.send("Logout Successfully!!");
});

module.exports = authRouter;
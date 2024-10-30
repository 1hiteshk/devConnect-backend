const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: [true, 'First name is required'],
        minlength: 3,
        maxlength: 30
    },
    lastName: {type: String},
    emailId: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase:true,
        trim: true,
       // validate: [validator.isEmail, 'Invalid email']
       validate(value){
        if(!validator.isEmail(value)){
            throw new Error(`Invalid Email Address ${value}`)
        }
       }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error(`Password is weak : ${value}`)
            }
        }
    },
    age:{
        type:Number,
        min: 18,
    },
    gender: {
        type: String,
        enum: { values:['male', 'female', 'other'],
            message: `{VALUE} is not a valid gender type`
        },
       // default:'male'
         // validate(value) {
      //   if (!["male", "female", "others"].includes(value)) {
      //     throw new Error("Gender data is not valid");
      //   }
      // },
    },
    photoUrl:{
        type: String,
        default: 'https://w7.pngwing.com/pngs/340/956/png-transparent-profile-user-icon-computer-icons-user-profile-head-ico-miscellaneous-black-desktop-wallpaper.png',
        validate(value){
            if(!validator.isURL(value)){
                throw new Error(`Invalid photo URL : ${value}`)
            }
        }
    },
    about:{
        type:String,
        default:'This is a default Bio of the user!'
    },
    skills:{
        type: [String]
    }
},{timestamps:true});

// we can attach methods (functions) on Schema models
userSchema.methods.getJWT = async function(){
    const user = this ;

    const token = await jwt.sign({_id: user._id}, "Connect2Dev@365", {
        expiresIn: "7d"
    })
    return token;
};

userSchema.methods.validatePassword =  async function (passwordInputByUser){
    const user = this;
    const passwordHash = user.password;
// to validate password entered by user and compare this to one stored in DB in hashPassword from using bcrypt.compare()
    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser,
        passwordHash
    );

    return isPasswordValid;
}

module.exports = mongoose.model('User', userSchema);
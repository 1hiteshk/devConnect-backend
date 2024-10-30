const mongoose = require('mongoose');

const connectDB = async()=>{
    await mongoose.connect(
        'mongodb+srv://1hiteshk:9dEbrRqQvwOqEdpr@cluster0.w2gnbzr.mongodb.net/Connect2Dev'
    )
}

module.exports = connectDB;
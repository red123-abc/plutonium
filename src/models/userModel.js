const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    mobile: String,  
    emailId: String,
    password: String,
    gender: { type: String, enum: ["male", "female", "other"] },
    age: Number,
    isDeleted: { type: Boolean, default: false },
    post:{type:[],default:[]}
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema)
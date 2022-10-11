const emailRegex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const mobileRegex=/^[6-9]\d{9}$/
const passRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/
const pincodeRegex=/^[1-9][0-9]{5}$/
const ImgRegex=/(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/
const mongoose = require("mongoose")

function isValidPhoneNumber(data){
    return mobileRegex.test(data)
}

function isValidEmail(data){
    return emailRegex.test(data)
}

//  to complete 2 purpose
function isValid(data){
    if(typeof data == undefined || data == null) return false
    if(typeof data == "string" && data.trim().length==0) return false
    return true
}

function isValidPassword(data){
    if(passRegex.test(data) && data.length>8 && data.length<15) return true
    return false
}

function isValidImageUrl(data){
    return ImgRegex.test(data)
}

function isValidObject(data){
    if(Object.prototype.toString.call(data)=="[object Object]" && Object.keys(data).length!=0) return true
    return false
} 

function isLetters(data){
    if(typeof data=="string" && data.trim().length!==0 && /^[a-z A-Z]+$/.test(data)) return true
    return false
}

function isValidPincode(data){
    if(typeof data =="number" && pincodeRegex.test(data)) return true
    return false
}

function isValidObjectId (data){
    return mongoose.Types.ObjectId.isValid(data)
}

module.exports={
    isValid,
    isValidPhoneNumber,
    isValidEmail,
    isValidPassword,
    isValidImageUrl,
    isValidObject,
    isValidPincode,
    isLetters,
    isValidObjectId
}
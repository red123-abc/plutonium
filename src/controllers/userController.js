const userModel = require("../models/userModel")
const {redis,validator} = require("../utils")
const bcrypt = require("bcrypt")

const newUser = async function(req,res){
    try{

    if(Object.keys(req.body).length==0){
        return res.status(400).send({status:false, message:"pls provide user details"}) 
    }
    const {fname,lname,email,profileImage,phone,password,address}=req.body
    
    //======================= Check for mandatory fields & Validating fields that has type "string"  ==========================
    let mandatoryFields = ["fname","lname","email","profileImage","phone","password","address"]
    for(let key of mandatoryFields){
        if(!validator.isValid(req.body[key])){
            return res.status(400).send({status:false, message:`value of ${key} must be present `}) 
        }
    }

    // validating fname
    if(!validator.isLetters(fname)){
        return res.status(400).send({status:false, message:"fname can only contain letters"})
    }

    // validating lname
    if(!validator.isLetters(lname)){
        return res.status(400).send({status:false, message:"lname can only contain letters"})
    }


    // vaidating email
    if(!validator.isValidEmail(email)){
        return res.status(400).send({status:false, message:"Invalid email"}) 
    }

    // validating phoneNumber
    if(!validator.isValidPhoneNumber(phone)){
        return res.status(400).send({status:false, message:"Invlaid Indian phone number"}) 
    }

    // validating password
    if(!validator.isValidPassword(password)){
        return res.status(400).send({status:false, message:"password must contain uppercase,lowercase,number and special charactor "}) 

    }

    // generating encrypted pass
    const encryptPass = bcrypt.hash(password,10,function(err,result){
        if(err){
            return res.status(400).send({status:false, message:err})
        }
        else{
            req.body["password"]=result
        }
    })

    // validating prfileImage
    if(!validator.isValidImageUrl(profileImage)){
        return res.status(400).send({status:false , message:"Invalid url"})
    }

   
    // validating address
    const {shipping,billing}=req.body["address"]
    if(!validator.isValidObject(address)){
        return res.status(400).send({status:false, message:"address can only be object type"})
    }

    let nestObj=["street","pincode","city"]
    for(let key of nestObj){
        if(!validator.isValid(shipping[key])){
            return res.status(400).send({status:false, message:`${key} must be present in shipping field`})
        }
        if(!validator.isValid(billing[key])){
            return res.status(400).send({status:false, message:`${key} must be present in billing field`})
        }
    }

    // validating field present in billing and shipping fields
    if(!validator.isLetters(shipping["city"]) || !validator.isLetters(billing["city"])){
        return res.status(400).send({status:false, message:"city can contains letters / String type only"})
    }
    if(!validator.isValid(shipping["street"]) || !validator.isValid(billing["street"])){
        return res.status(400).send({status:false, message:"street can be String type only"})
    }
    if(!validator.isValidPincode(shipping["pincode"]) || !validator.isValidPincode(billing["pincode"])){
        return res.status(400).send({status:false, message:"Invalid pincode"})
    }

    // Check for uniqueness for email and phone
    const existedData = await userModel.find({$or:[{email},{phone}]})
    for(let key of existedData){
        if(key["email"]==email.trim().toLowerCase()){
            return res.status(400).send({status:false, message:"Email is already taken"})
        }
        if(key["phone"]==phone.trim()){
            return res.status(400).send({status:false, message:"phone is already taken"})
        }

    }

    // creating user document
    const newUser = await userModel.create(req.body)
    return res.status(201).send({status:true, message:"User created successfully", data:newUser})

    }     
    catch(err){
        return res.status(500).send({status:false, message:err.message})
    }
}

module.exports={
    newUser
}














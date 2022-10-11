const userModel = require("../models/userModel")
const {redis,validator,aws} = require("../utils")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { set } = require("mongoose")

const newUser = async function(req,res){
    try{

    if(Object.keys(req.body).length==0){
        return res.status(400).send({status:false, message:"pls provide user details"}) 
    }
    console.log(req.body.data)
    let {fname,lname,email,profileImage,phone,password,address}=JSON.parse(req.body.data)
    
    //======================= Check for mandatory fields & Validating fields that has type "string"  ==========================
    let mandatoryFields = ["fname","lname","email","phone","password","address"]
    for(let key of mandatoryFields){
        if(!validator.isValid(JSON.parse(req.body.data)[key])){
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

    // generating encrypted password
    // hash Sting(round) . has(pass) ///  
    const encryptPass = bcrypt.hash(password,10,function(err,result){
        if(err){
            return res.status(400).send({status:false, message:err})
        }
        else{
            console.log(result)
            password=result
        }
    })

   
    // validating address
    if(!validator.isValidObject(address)){
        return res.status(400).send({status:false, message:"address can only be object type"})
    }
    const {shipping,billing}=address
   
    if(!validator.isValidObject(shipping)){
        return res.status(400).send({status:false, message:"shipping must a object"})
    }
    if(!validator.isValidObject(billing)){
        return res.status(400).send({status:false, message:"billing must a object"})
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

    // uploading files on aws s3
    const files = req.files
    // console.log(files)

    if(files && files.length>0){
        const url = await aws.uploadFile(files[0])
        profileImage = url
    }
    else{
        return res.status(400).send({status:false, message:"no file found"})
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
    const data ={fname,lname,email,profileImage,phone,password,address}
    // creating user document
    const newUser = await userModel.create(data)
    return res.status(201).send({status:true, message:"User created successfully", data:newUser})

    }     
    catch(err){
        
        return res.status(500).send({status:false, message:err.message})
       
    }
}

const login = async function(req,res){
    try{
        if(Object.keys(req.body).length==0){
            return res.status(400).send({status:false, message:"pls provide user details"}) 
        }

        let {email,password}=req.body

        let mandatoryFields = ["email","password",]

        for(let key of mandatoryFields){
            if(!validator.isValid(req.body[key])){
                return res.status(400).send({status:false, message:`value of ${key} must be present `}) 
            }
        }

        if(!validator.isValidEmail(email)){
            return res.status(400).send({status:false, message:"Invalid email"}) 
        }
        
        let user = await userModel.findOne({email})
        if (!user) {
            return res.status(400).send({ status: false, message: "Invalid credentials" })
          }

        // let isValid = true
        const encryptPass = bcrypt.compare(password,user.password,function(err,result){
            // console.log(result)
            if(result){
                let token = jwt.sign(
                    {
                      userId: user._id.toString(),
                      Team: "Group 38",
                      organisation: "FunctionUp"
                    },
                    "confidential-Group38-secret-key", 
                    { expiresIn: '1h' }
                  );
              
                  return res.status(200).send({ status: true, msg: "login successful", data: {  userId: user._id ,token: token } });
            }
            else{
                return res.status(401).send({status:false, message:"Invalid credentials"})
            }
        })
      
    }catch(err){
        return res.status(500).send({status:false, message:err.message})
    }
}

const getUser = async function(req,res){
    try{
        
        const userId = req.params.userId
        

        if(!validator.isValidObjectId(userId)){
            return res.status(400).send({status:false, message:"Invalid userId"})
        }
        
        const userDetails = await userModel.findById(userId)
        if(!userDetails){
            return res.status(404).send({status:false, message:"no user found"})
        }

        return res.status(200).send({status:true, message:"User profile details", data:userDetails})
    }
    catch(err){
        return res.status(500).send({status:false, message:err.message})
    }
}

const updateUser = async function(req,res){
    try{
        const userId = req.params.userId
        // validating userId
        if(!validator.isValidObjectId(userId)){
            return res.status(400).send({status:false, message:"Invalid userID"})
        }

        if(Object.keys(req.body).length==0){
            return res.status(400).send({status:false, message:"pls provide user details"}) 
        }

        let {fname,lname,email,profileImage,phone,password,address}=JSON.parse(req.body.data)
        let obj={}
    
        // validating fname
        if(fname){
            if(!validator.isLetters(fname)){
                return res.status(400).send({status:false, message:"fname can only contain letters"})
            }
            obj.fname=fname
        }
    
        // validating lname
        if(lname){
            if(!validator.isLetters(lname)){
                return res.status(400).send({status:false, message:"lname can only contain letters"})
            }
            obj.lname=lname
        }
    
        // vaidating email
        if(email){
            if(!validator.isValidEmail(email)){
                return res.status(400).send({status:false, message:"Invalid email"}) 
            }
            obj.email=email
        }
        
        // validating phoneNumber
        if(phone){
            if(!validator.isValidPhoneNumber(phone)){
                return res.status(400).send({status:false, message:"Invlaid Indian phone number"}) 
            }
            obj.phone=phone
        }
    
        // validating password
        if(password){
            if(!validator.isValidPassword(password)){
                return res.status(400).send({status:false, message:"password must contain uppercase,lowercase,number and special charactor "}) 
        
            }
         
            const encryptPass = bcrypt.hash(password,10,function(err,result){
                if(err){
                    return res.status(400).send({status:false, message:err})
                }
                else{
                    // console.log(result)
                    obj.password=result
                }
            })
        }
        
        // validating address
        if(address){
            if(!validator.isValidObject(address)){
                return res.status(400).send({status:false, message:"address can only be object type"})
            }
            const {shipping,billing}=address
           
            if(shipping){
                if(!validator.isValidObject(shipping)){
                    return res.status(400).send({status:false, message:"shipping must a object"})
                }
                
                let {street,pincode,city}=shipping
                if(street){
                    if(!validator.isValid(shipping["street"]) ){
                        return res.status(400).send({status:false, message:"street can be String type only in shipping"})
                    }
                }
                if(pincode){
                    if(!validator.isValidPincode(shipping["pincode"]) ){
                        return res.status(400).send({status:false, message:"Invalid pincode in shipping"})
                    }
                }
                if(city){
                    if(!validator.isLetters(shipping["city"]) ){
                        return res.status(400).send({status:false, message:"city can contains letters / String type only in shipping"})
                    }
                }
            }
            if(billing){
                if(!validator.isValidObject(billing)){
                    return res.status(400).send({status:false, message:"billing must a object"})
                }

                let {street,pincode,city}=billing
                if(street){
                    if( !validator.isValid(billing["street"])){
                        return res.status(400).send({status:false, message:"street can be String type only in billing"})
                    }
                }
                if(pincode){
                    if( !validator.isValidPincode(billing["pincode"])){
                        return res.status(400).send({status:false, message:"Invalid pincode in billing"})
                    }
                }
                if(city){
                    if(!validator.isLetters(billing["city"])){
                        return res.status(400).send({status:false, message:"city can contains letters / String type only in billing"})
                    }
                }
            }
            obj.address=address
        }
        
    
        // uploading files on aws s3
        const files = req.files
        // console.log(files)
    
        if(files && files.length>0){
            const url = await aws.uploadFile(files[0])
            obj.profileImage = url
        }
        
    
        // Check for uniqueness for email and phone
        if(email || phone){
            const existedData = await userModel.find({$or:[{email},{phone}]})
            for(let key of existedData){
                if(email){
                    if(key["email"]==email.trim().toLowerCase()){
                        return res.status(400).send({status:false, message:"Email is already taken"})
                    }
                }
                if(phone){
                    if(key["phone"]==phone.trim()){
                        return res.status(400).send({status:false, message:"phone is already taken"})
                    }
                }
            }
        }

        // check for authorization
        if(req.userId!=userId){
            return res.status(403).send({status:false, message:"Unauthorization"})
        }

        const updatedUser = await userModel.findByIdAndUpdate(userId,obj,{new:true})
        return res.status(200).send({status:true, message:"User profile updated", data:updatedUser})
       
    }
    catch(err){
        return res.status(500).send({status:false, message:err.message})
    }
}

module.exports={
    newUser,
    login,
    getUser,
    updateUser
}














const userModel = require('../Models/userModel')

// =========== CREATE USER =====================

const userCreate = async function (req,res){
    let userData = req.body
    let saveData = await userModel.create(userData)
    return res.status(201).send({status:true, massage:"success",data:saveData})
}


//===========LOGIN USER===========================

const loginUser = async function(req,res){
    let loginData = req.body
    let saveData =await userModel.findOne({email, password})
    return res.status(401).send({status:false, massage:"invalid"})
}





module.exports.userCreate = userCreate
module.exports.loginUser = loginUser
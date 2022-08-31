const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

//=========================api-1========================================>>>

const createUser = async function(req,res){
    let data = req.body;
    let user = await userModel.create(data);
    res.send({data:user});
}

//=========================api-2========================================>>>

const loginUser = async function(req,res){
    let email = req.body.emailId ;
    let password = req.body.password ;
    let login = await userModel.find({emailId: email, password: password});
    if(!login){
        return res.semd({msg : "Email & Password is not correct"});
    }
    let token = jwt.sign({
        userId : login._id ,    //payload
        batch : "Plutonium"
    },"functionUp-Plutonium")   //secret key
    res.setHeader("x-auth-token", token)
    res.send({status:true, data :{ token : token}});
}

//=========================api-3========================================>>> 

const getUser = async function(req,res){
   
    let userId= req.params.userId ;
    let userDetails = await userModel.findById(userId);
    res.send({status:true , data: userDetails});
}

//=========================api-4========================================>>>
 
const updateUser = async function(req,res){
    let userId = req.params.userId;
    
    let userDetails = await userModel.findById(userId);
    if(!userDetails){
        return res.send({status:false, msg:"no such user is exist"});
    }
    let  userData = req.body;
    let updateUser = await userModel.findOneAndUpdate({_id: userId}, userData, {new :true});
    res.send({status:true , data: updateUser});

}

//=========================api-5========================================>>>

const deleteUser = async function(req,res){
    let userId = req.params.userId;

    let userDetails = await userModel.findById(userId);
    if(!userDetails){
        return res.send({status:false, msg:"no such user is exist"});
    }
    let userData = req.body ;
    userData.isDeleted = true ;
    let deleteUser = await userModel.updateOne({_id: userId}, userData, {new: true})
    res.send({status : true , data : deleteUser}); 
}

//=======================================================================>>>

module.exports.createUser = createUser;
module.exports.loginUser = loginUser;
module.exports.getUser = getUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
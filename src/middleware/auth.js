const jwt =require("jsonwebtoken")

const validateToken = async function(req, res, next) {
    let token=req.headers["x-auth-token"];
    if(!token)token=req.headers["X-Auth-Token"];
    if(!token)return res.send({status:false , msg:"token must be present"});
    console.log(token);
    let decodedToken=jwt.verify(token,"function-plutonium-very-secret-key");
    if(!decodedToken){
        return res.send({status:false,msg:"token is invalid"});
    }
    // req.loggedInUser=decodedToken.userId
    next()
}


const checkIfAuthorized =async function(req, res, next) {
    let token = req.headers["x-auth-token"];
    if(!token) token = req.headers["X-Auth-Token"];
    if(!token){
        return res.send({status:false, msg: 'Token must be present'});
    }
    let decodedToken = jwt.verify(token, "function-plutonium-very-secret-key");
    if(!decodedToken){
        return res.send({status:false, msg: 'token is invalid'});
    }
    let userToBeModified = req.params.userId;
    let userLoggedin = decodedToken.userId;
    if(userToBeModified!==userLoggedin){
        return res.send({status:false, msg:"user loggedin not allowed to modify changes"});
    }
    next();
}
module.exports.validateToken=validateToken
module.exports.checkIfAuthorized=checkIfAuthorized
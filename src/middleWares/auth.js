const jwt = require('jsonwebtoken');


const validToken = async function(req,res, next){
    let token = req.headers["x-auth-token"];
    if(!token) token = req.headers["X-Auth-Token"];
    if(!token){
        return res.send({status:false, msg: 'Token must be present'});
    }
    let decodedToken = jwt.verify(token, "functionUp-Plutonium");
    if(!decodedToken){
        return res.send({status:false, msg: 'Token is invalid'});
    }
    next();
}

module.exports.validToken = validToken ;
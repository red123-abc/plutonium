const jwt = require("jsonwebtoken")
const secreteKey = "confidential-Group38-secret-key"

const authenticationMid = async function(req,res,next){
    try{
        let bearerToken = req.headers["authorization"]
        // console.log(req.headers)
        if(typeof bearerToken == "undefined"){
            return  res.status(400).send({status:false, message:"bearer token is missing"}) 
        }
        bearerToken=bearerToken.split(" ")[1]
        const decode = jwt.verify(
            bearerToken,
            secreteKey,
            function(err,result){
                if(err) return res.status(401).send({status:false, message:err})
                else {
                    req.userId = result.userId
                    next()
                }
            }
        )
    }
    catch(err){
        return res.status(500).send({status:false, message:err.message})
    }
}

module.exports={
    authenticationMid
}
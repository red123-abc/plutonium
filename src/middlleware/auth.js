const jwt = require("jsonwebtoken")
const secreteKey = "confidential-Group38-secret-key"

const authenticationMid = async function(req,res,next){
    try{
        const bearerToken = req.headers["authentication"].split(" ")[1]
        if(typeof bearerToken == "undefined"){
            return  res.status(400).send({status:false, message:"token is missing"}) 
        }

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
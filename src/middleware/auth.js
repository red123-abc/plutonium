const jwt = require('jsonwebtoken');


// ========================= Authentication ===============

const authentication = function (req, res, next) {
try {
       let token =req.headers["x-api-key"]
       if(!token){
       return res.status(400).send({ status: false , massage:"token is required"})
       }else{
          const validToken =jwt.decode(token)
          if(validToken){
                    jwt.verify(token, "project-booksManagementGroup59")
          }
                 req.decodedToken = validToken;
                 next();
       }
 } catch (error) {
                    return res.status(500).send({ status: false, message: error.message });
}
};

// ======================== Authorization ===============
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");

// ========================= Authentication =====================

// const authentication = function (req, res, next) {
// try {
//        let token =req.headers["x-api-key"]
//        if(!token){
//        return res.status(400).send({ status: false , massage:"token is required"})
//        }else{
//           const validToken =jwt.decode(token)
//           if(validToken){
//                     jwt.verify(token, "project-booksManagementGroup59")
//           }
//               //    req.decodedToken = validToken;
//                  next();
//        }
//  } catch (error) {
//                     return res.status(500).send({ status: false, message: error.message });
// }
// };
const authentication = (req,res,next)=>{ 
           try{ 
           //FETCH TOKEN FROM HEADER----  
           let token = req.headers["x-auth-token"||"X-Auth-Token"] 
           if (!token) { 
              return res.status(400).send({ status:false,message: "no token found" }) 
           } 
        
           // DECODE TOKEN FETCH BY FROM HEADER---- 
           let decodedToken = jwt.verify(token, "project-booksManagementGroup59") 
           if(!decodedToken){ 
              return res.staus(401).send({status:false,message:"Invalid token"}) 
           } 
           req.decodedToken=decodedToken 
           
           next(); 
       }catch(err){ 
           res.status(500).send({status:false,message:err.message}) 
       } 
       }
      




// ========================Authorization========================

const authorizations = async function (req, res, next) {
       try {
              const blogId = req.params.blogId;

              if (!mongoose.Types.ObjectId.isValid(blogId)){
                  return res.status(400).send({ msg: "blog_id is not valid" });
              }
              const blog = await blogModel.findById(blogId);
                console.log(blog);

              const token = req.headers["x-api-key"];
              const decodedToken = jwt.verify(token, "project-booksManagementGroup59");
              if (blog.userId == decodedToken.userId) {
                     
                     next();
              } else {
                     return res.status(403).send({ status: false, message: "Authorisation failded" });
              }

       } catch (err) {
              console.log('This is the error :', err.message);
              res.status(500).send({ msg: 'Error', error: err.message });
       }
};

// Destructuring
module.exports = { authentication, authorizations }




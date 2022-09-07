const jwt = require('jsonwebtoken')
const blogModel = require('../models/blogModel')

const authentication = function (req, res, next) {
    try {
      let token = req.headers["x-api-key"]
      if (!token){ 
      return res.status(400).send({ status: false, msg: "token is required" })
      }else{
        const validToken = jwt.decode(token)
        if(validToken){
            jwt.verify(token,"project-1")
            next()
        }
      }
    
    }
  catch (err) {
      console.log("This is the error:", err.message)
      res.status(500).send({status:false, msg: "Error", error: err.message })
    }
  };

  const authorisation = async function (req, res, next) {
    try {
      const blogId = req.params.blogId;
      const blog = await blogModel.findById(blogId);
      console.log(blog)

      const token = req.headers["x-api-key"];
      const decodedToken = jwt.verify(token,"project-1")
      if(blog.authorId==decodedToken.authorId){
        next()
      }else{
        return res.status(403).send({status:false,message:"Authorisation failded"})
      }
      
    } catch (err) {
      console.log('This is the error :', err.message);
      res.status(500).send({ msg: 'Error', error: err.message });
    }
  };

  



  module.exports.authentication = authentication
  module.exports.authorisation = authorisation
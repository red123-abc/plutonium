const express = require("express")
const route = express.Router()
const {userController}=require("../controllers")

route.get("/test-me", function(req,res){
    res.send("running")
})

route.post("/register", userController.newUser)

module.exports=route
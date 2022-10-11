const express = require("express")
const route = express.Router()
const {userController}=require("../controllers")
const auth = require("../middlleware/auth")

route.get("/test-me", function(req,res){
    res.send("running")
})

route.post("/register", userController.newUser)

route.post("/login", userController.login)

route.get("/user/:userId/profile",auth.authenticationMid, userController.getUser)

route.put("/user/:userId/profile", auth.authenticationMid, userController.updateUser)

module.exports=route
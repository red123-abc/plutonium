const { Router } = require("express")
const express = require("express")
const route = express.Router()
const {userController,productController}=require("../controllers")
const auth = require("../middlleware/auth")

route.get("/test-me", function(req,res){
    res.send("running")
})

route.post("/register", userController.newUser)

route.post("/login", userController.login)

route.get("/user/:userId/profile",auth.authenticationMid, userController.getUser)

route.put("/user/:userId/profile", auth.authenticationMid, userController.updateUser)

route.post("/products",productController.newProduct )

route.get("/products",productController.getByQuery)

route.get("/products/:productId",productController.getById)

route.delete("/products/:productId",productController.deleteProduct)

module.exports=route
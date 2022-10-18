const { Router } = require("express")
const express = require("express")
const route = express.Router()
const {userController,productController,cartController,orderController}=require("../controllers")
const auth = require("../middlleware/auth")

route.get("/test-me", function(req,res){
    res.send("running")
})

//============ User Api's ==============
route.post("/register", userController.newUser)
route.post("/login", userController.login)
route.get("/user/:userId/profile",auth.authenticationMid, userController.getUser)
route.put("/user/:userId/profile", auth.authenticationMid, userController.updateUser)

//============ Product Api's ==============
route.post("/products",productController.newProduct )
route.get("/products",productController.getByQuery)
route.get("/products/:productId",productController.getById)
route.put("/products/:productId",productController.updateProduct)
route.delete("/products/:productId",productController.deleteProduct)

//============ Cart Api's ==============
route.post("/users/:userId/cart", auth.authenticationMid, cartController.createCart)
route.put("/users/:userId/cart", auth.authenticationMid, cartController.updateCart)
route.get("/users/:userId/cart", auth.authenticationMid, cartController.getCart)
route.delete("/users/:userId/cart", auth.authenticationMid, cartController.deleteCart)

//============ Order Api's ==============
route.post("/users/:userId/orders", auth.authenticationMid, orderController.createOrder)
route.put("/users/:userId/orders", auth.authenticationMid, orderController.updateOrder)


module.exports=route
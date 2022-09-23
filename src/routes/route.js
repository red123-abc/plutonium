const { Router } = require('express');
const express = require('express');
const router = express.Router();
const bookController = require("../controller/bookController")
const reviewController = require("../controller/reviewController")
const userController = require("../controller/userController")
const middleware =require("../middleware/auth.js")




//========================= create And login User =============
router.post('/register', userController.userCreate);
router.post('/login', userController.loginUser)


//========================= createBook =============
router.post('/books',middleware.authentication,bookController.createBook)


router.put('/books/:bookId', middleware.authentication, middleware.authorizations, bookController.updateBook)
router.delete('/books/:bookId',middleware.authentication,middleware.authorizations,bookController.deleteBookById )








// router.all('/**', function(){
//           return res.status(400).send({status: false , massage: "Invalid request"})
// })

module.exports = router
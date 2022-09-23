const express = require('express');
const router = express.Router();
const bookController = require("../controller/bookController")
const reviewController = require("../controller/reviewController")
const userController = require("../controller/userController")
const middleware = require("../middleware/auth");



// user
router.post('/register', userController.userCreate);
router.post('/login', userController.loginUser)

// book
router.post('/books',middleware.authentication,bookController.createBook)
router.delete('/books/:bookId',middleware.authentication,middleware.authorizations,bookController.deleteBookById )







// router.all('/*', function(){
//           return res.status(400).send({status: false , massage: "Invalid request"})
// })

module.exports = router
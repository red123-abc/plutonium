const { Router } = require('express');
const express = require('express');
const router = express.Router();
const bookController = require("../controller/bookController")
const reviewController = require("../controller/reviewController")
const userController = require("../controller/userController")
const middleware =require("../middleware/auth.js")



//=========We have created USER API==================

router.post('/register', userController.userCreate);
router.post('/login', userController.loginUser)


//========================= createBook =============
router.post('/createsBook', middleware.authentication ,bookController.createBook)

// router.put('/books/:bookId', bookController.updateBook)





router.all('/*', function(){
          return res.status(400).send({status: false , massage: "Invalid request"})
})

module.exports = router
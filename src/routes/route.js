const express = require('express');
const router = express.Router();
const bookController = require("../controller/bookController")
const reviewController = require("../controller/reviewController")
const userController = require("../controller/userController")


//=========We have created USER API==================

router.post('/register', userController.userCreate);
router.get('/login', userController.loginUser)

router.all('/*', function(){
          return res.status(400).send({status: false , massage: "Invalid request"})
})

module.exports = router
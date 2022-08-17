// const express = require('express');
// const router = express.Router();
// // const UserModel= require("../models/userModel.js")
// const UserController= require("../controllers/userController")
// const BookController= require("../controllers/bookController")

// router.get("/test-me", function (req, res) {
//     res.send("My first ever api!")
// })

// router.post("/createUser", UserController.createUser  )

// router.get("/getUsersData", UserController.getUsersData)

// router.post("/createBook", BookController.createBook  )

// router.get("/getBooksData", BookController.getBooksData)

// module.exports = router;

//======================================================== Assignment Solution ==========================================

const express = require('express');
const router = express.Router();
const bookModel = require('../models/bookModel');
const bookController = require('../controllers/bookController');
router.get('/test-me', function (req, res) {
 res.send('My first ever api!');
});
router.post('/createBooks', bookController.createBooks);
router.get('/getAllBooks', bookController.getAllBooks);
router.get('/booksData', bookController.booksData);
router.get('/getBooksInYear', bookController.getBooksInYear);
router.get('/getparticularBooks', bookController.getparticularBooks);
router.get('/getXINRBooks', bookController.getXINRBooks);
router.get('/getRandomBooks', bookController.getRandomBooks);
module.exports = router;


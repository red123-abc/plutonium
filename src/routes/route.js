const express = require('express');
const router = express.Router();
const bookController = require("../controller/bookController")
const reviewController = require("../controller/reviewController")
const userController = require("../controller/userController")
const middleware =require("../middleware/auth.js")


//========================= create And login User =============
router.post('/register', userController.userCreate);
router.post('/login', userController.loginUser)


//========================= bookController =============
router.post('/books',middleware.authentication,bookController.createBook)
router.get('/books',middleware.authentication,bookController.getBooks)
router.get('/books/:bookId',middleware.authentication,bookController.getBookById)
 router.put('/books/:bookId', middleware.authentication, middleware.authorizations, bookController.updateBook)
 router.delete('/books/:bookId',middleware.authentication,middleware.authorizations,bookController.deleteBookById )

// =============reviewController====================================
router.post('/books/:bookId/review', reviewController.createReview) 
router.put('/books/:bookId/review/:reviewId', reviewController.updateReviewBookByBookid )
router.delete('/books/:bookId/review/:reviewId',reviewController.deleteBookReview) 


// ================= Invalid Request Url ===============

router.all('/**', function(req,res){
          return res.status(400).send({status: false , massage: "Invalid request"})
})

module.exports = router
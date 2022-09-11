const express = require('express');
const router = express.Router();
const middleware = require('../middleware/auth')

const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")


router.post("/authors", authorController.createAuthor)

router.post("/blogs",middleware.authentication, blogController.createBlog)

router.get("/blogs",middleware.authentication, blogController.getBlog)

router.put("/blogs/:blogId",middleware.authentication,middleware.authorisation, blogController.updatedBlog)

router.delete("/blogs/:blogId",middleware.authentication,middleware.authorisation,blogController.deletedBlog)

router.delete("/blogs",middleware.authentication,blogController.deletebyquery)

router.post("/loginUser",authorController.loginUser)

module.exports = router;
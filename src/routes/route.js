const express = require('express');
const router = express.Router();
const middlewear = require('../middlewear/auth')

const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")


router.post("/authors", authorController.createAuthor)

router.post("/blogs",middlewear.authentication, blogController.createBlog)

router.get("/blogs",middlewear.authentication, blogController.getBlog)

router.put("/blogs/:blogId",middlewear.authentication,middlewear.authorisation, blogController.updatedBlog)

router.delete("/blogs/:blogId",middlewear.authentication,middlewear.authorisation,blogController.deletedBlog)

router.delete("/blogs",middlewear.authentication,blogController.deletebyquery)

router.post("/loginUser",authorController.loginUser)

module.exports = router;
const express = require('express');
const router = express.Router();
const middlewear = require('../middlewear/auth')

const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")


router.post("/authors", authorController.createAuthor)

router.post("/blogs",middlewear.mid1, blogController.createBlog)

router.get("/blogs",middlewear.mid1, blogController.getBlog)

router.put("/blogs/:blogId",middlewear.mid1,middlewear.mid2, blogController.updatedBlog)

router.delete("/blogs/:blogId",middlewear.mid1,middlewear.mid2,blogController.deletedBlog)

router.delete("/blogs",blogController.deleteBlogByQuery)

router.post("/loginUser",authorController.loginUser)

module.exports = router;
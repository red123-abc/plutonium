const express = require('express');
const router = express.Router();

const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")


router.post("/authors", authorController.createAuthor)

router.post("/blogs", blogController.createBlog)

router.get("/blogs", blogController.getBlog)

router.put("/blogs/:blogId", blogController.updatedBlog)

router.delete("/blogs/:blogId",blogController.deletedBlog)

router.delete("/blogs",blogController.deletebyquery)

module.exports = router;
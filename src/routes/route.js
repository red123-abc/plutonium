const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController")
const middleware = require('../middleware/commonMiddleware');

router.post("/users", middleware.mid1,userController.createUser)
router.post("/login",  middleware.mid1,userController.loginUser)
router.get("/users/:userId", middleware.mid2, userController.getUserData)
router.put("/users/:userId", middleware.mid1, middleware.mid2, userController.updateUser)
router.delete("/users/:userId", middleware.mid1, middleware.mid2, userController.deleteUser)
router.post("/users/:userId/post", middleware.mid1, middleware.mid2, userController.postMessage)

module.exports = router;
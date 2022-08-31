const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController")
const middleware = require('../middleware/commonMiddleware');

router.post("/users", userController.createUser)
router.post("/login", userController.loginUser)
router.get("/users/:userId", middleware.tokenVerification, userController.getUserData)
router.put("/users/:userId", middleware.tokenVerification, userController.updateUser)
router.delete("/users/:userId", middleware.tokenVerification, userController.deleteUser)
router.post("/users/:userId/post", middleware.tokenVerification, userController.postMessage)

module.exports = router;



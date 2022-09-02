const express = require('express');
const router = express.Router();
const controller = require("../controllers/controller")

router.get("/getAllMemes", controller.getAllMemes);
router.post("/createMeme", controller.createMeme);

module.exports = router;
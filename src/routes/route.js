// const express = require('express');
// const router = express.Router();
// const userController= require("../controllers/userController")

// router.get("/test-me", function (req, res) {
//     res.send("My first ever api!")
// })

// router.post("/users", userController.createUser  )

// router.post("/login", userController.loginUser)

// //The userId is sent by front end
// router.get("/users/:userId", userController.getUserData)

// router.put("/users/:userId", userController.updateUser)

// module.exports = router;

const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const auth = require('../middleWares/auth');


router.post('/createUser', userController.createUser);

router.post('/loginUser',userController.loginUser);

router.get('/getUser/:userId', auth.validToken , userController.getUser);

router.put('/updateUser/:userId',auth.validToken, userController.updateUser);

router.delete('/deleteUser/:userId',auth.validToken, userController.deleteUser);


module.exports = router;
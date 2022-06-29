
const express=require('express');
const router=express.Router()
const {createCollege} = require("../controller/collegeController");
const {createIntern,getIntern}= require("../controller/internController");



router.route('/functionup/colleges').post(createCollege);
router.route('/functionup/interns').post(createIntern);
router.route('/functionup/collegeDetails').get(getIntern);


module.exports = router;


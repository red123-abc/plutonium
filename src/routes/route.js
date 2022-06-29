
const express=require('express');
const router=express.Router();
const {createCollege} = require("../controller/collegeController");
const {createIntern}= require("../controller/internController");
const {getIntern}= require("../controller/collegeController");


router.route('/functionup/colleges').post(createCollege);

router.route('/functionup/interns').post(createIntern);

router.route('/functionup/collegeDetails').get(getIntern);


module.exports = router;


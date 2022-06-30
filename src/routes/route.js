
const express = require('express');
const router = express.Router();
const { createCollege } = require("../controller/collegeController");
const { createIntern } = require("../controller/internController");
const { getIntern } = require("../controller/collegeController");

//===================================================[COLLEGE ROUTE HANDLER]===========================================================

router.route('/functionup/colleges').post(createCollege);

router.route('/functionup/collegeDetails').get(getIntern);

//===================================================[INTERN ROUTE HANDLER]===========================================================

router.route('/functionup/interns').post(createIntern);

module.exports = router;


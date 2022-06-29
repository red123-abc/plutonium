
const internModel = require("../models/internModel.js")
const collegeModel = require("../models/collegeModel")
const validateEmail = require("email-validator")
let validString = /\d/;
const isValid = function (value) {
    if (typeof value == "undefined" || value == null) return false;
    if (typeof value == "string" && value.trim().length === 0) return false;
    return true;
}
const isValidReqestBody = function (requestBody) {
    return Object.keys(requestBody).length !== 0;
}


exports.createIntern = async function (req, res) {
    try {
        let internDetails = req.body

        if (!isValidReqestBody(internDetails)) {
            res.status(400).send({ status: false, message: `${internDetails} No College Detail Received` })
            return
        }
        const { name, email, mobile, collegeName } = internDetails
        if (!isValid(name) || validString.test(name)) {
            res.status(400).send({ status: false, msg: "Name is required" });
            return
        }
        if (!isValid(email)) {
            res.status(400).send({ status: false, msg: " email is required" });
            return
        }
        //checking if the email is valid by using email-validator package


        if (!validateEmail.validate(internDetails.email)) return res.status(400).send({ status: false, msg: "Enter a valid email" })

        if (!isValid(mobile)) {
            res.status(400).send({ status: false, msg: " mobile is required" });
            return
        }
        if (!/^\d{10}$/.test(mobile)) {
            res.status(400).send({ status: false, message: "Please provide valid mobile number" });
            return;
        }

        let uniqueValue = await internModel.findOne({ $or: [{ email: internDetails.email }, { mobile: internDetails.mobile }] })
        if (uniqueValue) return res.status(400).send({ status: false, msg: "email or mobile already Used" })

        if (!isValid(collegeName)) {
            res.status(400).send({ status: false, msg: " college name is required" });
            return
        }
        const getCollegeData = await collegeModel.findOne({ name: internDetails.collegeName }).select({ _id: 1 })
        if (!getCollegeData) return res.status(404).send({ status: false, msg: "enter a valid college name" })
        internDetails.collegeId = getCollegeData._id



        internData = await internModel.create(internDetails)
        return res.status(201).send({ status: true, data: internData })


    }

    catch (err) {
        console.log("This is the error:", err.message)
        res.status(500).send({ msg: "Error", error: err.message })

    }
}






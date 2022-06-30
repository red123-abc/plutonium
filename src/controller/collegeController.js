const collegeModel = require("../models/collegeModel.js");
const internModel = require("../models/internModel.js");


let validUrl = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/

let validString = /^[ a-z ]+$/i; //To validate String using RegEx
let validName = /\d/;
const isValid = function (value) {   //function to check entered data is valid or not
    if (typeof value == "undefined" || value == null) return false;
    if (typeof value == "string" && value.trim().length === 0) return false;
    return true;
}


//===================================================[API:FOR CREATING COLLEGE DB]===========================================================

exports.createCollege = async function (req, res) {
    try {
        if (Object.keys(req.query).length == 0) {
            let collegeDetails = req.body   //getting data from request body

            if (Object.keys(collegeDetails).length == 0) {  //validating is there any data inside request body
                res.status(400).send({ status: false, message: "No College Detail Received" })
                return
            }

            const { name, fullName, logoLink } = collegeDetails  //Destructuring data coming from request body 

            //here performing validation for data
            if (!isValid(name) || !name.match(validString)) {
                res.status(400).send({ status: false, msg: "Name is required and Enter Name in Correct Format" });
                return
            }
            if (!isValid(fullName) || validName.test(fullName)) {
                res.status(400).send({ status: false, msg: "FullName is required and Enter FullName in Correct Format" });
                return
            }
            if (!isValid(logoLink)) {
                res.status(400).send({ status: false, msg: "LogoLink is required" });
                return
            }

            if (!validUrl.test(logoLink)) return res.status(400).send({ msg: "Invalid url" });

            //checking is there same name present inside database or not
            let allReadyExisted = await collegeModel.findOne({ name: collegeDetails.name })
            if (allReadyExisted) {
                return res.status(400).send({ status: false, msg: `${name} already exist` });
            }
            //after clearing all the validation document will be created
            let createdCollege = await (await collegeModel.create(collegeDetails))
           
            let college = {    //storing all data in an object
                "name": createdCollege.name,
                "fullName": createdCollege.fullName,
                "logoLink": createdCollege.logoLink,
                "isDeleted": createdCollege.isDeleted
            }
            return res.status(201).send({ status: true, data: college })
        } else {
            return res.status(400).send({ status: false, message: "Invalid request you can't provide data in query param" });
        }

    } catch (err) {
        console.log(err.message)
        return res.status(500).send({ error: err.message })
    }

};

//===================================================[API:FOR GETTING LIST OF ALL INTERNS]===========================================================


exports.getIntern = async function (req, res) {

    try {

        let collegeName = req.query.collegeName; //storing data coming from query param 

        if (!isValid(collegeName)) { //validating user has entered any collegeName or not
            res.status(400).send({ status: false, msg: "Enter a College Name in the query parameter" });
            return
        }

        let findCollege = await collegeModel.findOne({ name: collegeName }) //checking that college present inside database or not
        if (!findCollege) return res.status(404).send({ status: false, msg: "No College Found" });

        //here getting name,email,mobile of intern based on collegeName
        let Intern = await internModel.find({ collegeId: findCollege }).select({ name: 1, email: 1, mobile: 1 });
        if (Intern.length == 0) {
            res.status(404).send({ status: false, msg: " No Intern Found" });
            return
        }
        let collegeAndAllIntern = {    //storing all data in an object
            "name": findCollege.name,
            "fullName": findCollege.fullName,
            "logoLink": findCollege.logoLink,
            "interns": Intern
        }

        res.status(200).send({ data: collegeAndAllIntern }) //sending data in response
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}








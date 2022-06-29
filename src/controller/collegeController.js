const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModel.js")

let validString = /\d/;
const isValid = function (value) {
    if (typeof value == "undefined" || value == null) return false;
    if (typeof value == "string" && value.trim().length === 0) return false;
    return true;
}
const isValidReqestBody = function (requestBody) {
    return Object.keys(requestBody).length !== 0;
}


exports.createCollege= async function(req,res){
    try{
        let collegeDetails=req.body

        if (!isValidReqestBody(collegeDetails)) {
            res.status(400).send({ status: false, message: `${collegeDetails} No College Detail Received` })
            return
        }

        const {name,fullName,logoLink}=collegeDetails

        if (!isValid(name) || validString.test(name)) {
            res.status(400).send({ status: false, msg: "Name is required and Enter Name in Correct Format" });
            return
        }
        if (!isValid(fullName)  || validString.test(fullName)) {
            res.status(400).send({ status: false, msg: "FullName is required and Enter FullName in Correct Format" });
            return
        }
        if (!isValid(logoLink)) {
            res.status(400).send({ status: false, msg: "LogoLink is required" });
            return
        }
        
        let allReadyExisted= await collegeModel.findOne({fullName:collegeDetails.fullName})
            if(allReadyExisted){
            return res.status(400).send({ status: false, msg: `${fullName} already exist` })
        }
        let createdCollege=await collegeModel.create(collegeDetails)
            return res.status(201).send({status:true,data:createdCollege, msg:"College Created Successfully"})
        
    }catch(err){
        console.log(err.message)
        return res.status(500).send({error:err.message})
    }

};

exports.getIntern = async function (req, res) {

    try {
        let collegeName = req.query.collegeName; 
        if (!isValid(collegeName)) {
            res.status(400).send({ status: false, msg: "Enter a College Name in the query parameter" });
            return
        }
        let findCollege = await collegeModel.findOne({ name: collegeName })
        if (!findCollege) return res.status(404).send({ status: false, msg: "No College Found" })

        let Intern = await internModel.find({ collegeId: findCollege }).select({ name: 1, email: 1, mobile: 1 });
        if(Intern.length==0){
            res.status(404).send({ status: false, msg: " No Intern Found" });
            return
        }
        let collegeAndAllIntern={
            "name" : findCollege.name,
            "fullName" : findCollege.fullName,
            "logoLink" : findCollege.logoLink,
            "Interns" : Intern
        }
        
        res.status(200).send({data: collegeAndAllIntern })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}








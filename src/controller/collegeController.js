const CollegeModel = require("../models/collegeModel")

let validString = /\d/;
const isValid = function (value) {
    if (typeof value == "undefined" || value == null) return false;
    if (typeof value == "string" && value.trim().length === 0) return false;
    return true;
}
const isValidReqestBody = function (requestBody) {
    return Object.keys(requestBody).length !== 0;
}


const createCollege= async function(req,res){
    try{
        let collegeDetails=req.body

        if (!isValidReqestBody(collegeDetails)) {
            res.status(400).send({ status: false, message: `${collegeDetails} No College Detail Received` })
            return
        }
        const {name,fullName,logoLink}=collegeDetails
        if (!isValid(name) || validString.test(name)) {
            res.status(400).send({ status: false, msg: "Name is required" });
            return
        }
        if (!isValid(fullName)  || validString.test(fullName)) {
            res.status(400).send({ status: false, msg: "FullName is required" });
            return
        }
        if (!isValid(logoLink)) {
            res.status(400).send({ status: false, msg: "LogoLink is required" });
            return
        }
        if(/\d/.test(name)){
            res.status(400).send({ status: false, msg: "Enter the Name in a correct format" });
            return
        
        }
        let allReadyExisted= await CollegeModel.findOne({$or:[{fullName:collegeDetails.fullName},{logoLink:collegeDetails.logoLink}]})
            if(allReadyExisted){
            return res.status(400).send({ status: false, msg: `${fullName} or ${logoLink} already exist` })
        }
        let createdCollege=await CollegeModel.create(collegeDetails)
            return res.status(201).send({status:true,data:createdCollege, msg:"College Created Successfully"})
        
    }catch(err){
        console.log(err.message)
        return res.status(500).send({error:err.message})
    }

};


module.exports.createCollege=createCollege

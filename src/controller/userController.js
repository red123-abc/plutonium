const userModel = require('../Models/userModel');
const validations = require('../validation/validation.js');
const jwt = require('jsonwebtoken');


// =================================== CREATE USER ==================================

const userCreate = async function (req, res) {
    try {

        let { title, name, phone, email, password, address, } = req.body;

        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Body is empty, please Provide data" });
        };
        if (!title) {
            return res.status(400).send({ status: false, message: "Title is required" });
        };
        if (!(["Mr", "Mrs", "Miss"].indexOf(title) !== -1)) {
            return res.status(400).send({ status: false, message: "Title is in wrong format" });
        };
        if (!name) {
            return res.status(400).send({ status: false, message: "Name is required" });
        };
        if (!validations.isValid(name)) {
            return res.status(400).send({ status: false, message: "Name is Empty" });
        };
        if (!/^[ a-z ]+$/i.test(name)) {
            return res.status(400).send({ status: false, message: "Name is in wrong formet" });
        };
        if (!phone) {
            return res.status(400).send({ status: false, message: "Phone is required" });
        };
        if (!/^[789]\d{9}$/.test(phone)) {
            return res.status(400).send({ status: false, message: "Please enter a valid phone number" });
        };

        let duplicatePhone = await userModel.findOne({ phone: phone });
        if (duplicatePhone) {
            return res.status(400).send({ status: false, message: `Phone No. already exists ` });
        };
        if (!email) {
            return res.status(400).send({ status: false, message: "Email is required" });
        };
        if (!validations.isValid(email)) {
            return res.status(400).send({ status: false, message: "Email is Empty" });
        };
        if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email.trim())) {
            return res.status(400).send({ status: false, message: "Email is invalid formet" });
        };

        let duplicateEmail = await userModel.findOne({ email: email });
        if (duplicateEmail) {
            return res.status(400).send({ status: false, message: `Email already exists` });
        };
        if (!password) {
            return res.status(400).send({ status: false, massage: "Password is requires" });
        };
        if (! /^[a-zA-Z0-9]{8,15}$/.test(password)) {
            return res.status(400).send({ status: false, message: " Password should be 8 to 15 characters" });
        };
        if (address && typeof address != "object") {
            return res.status(400).send({ status: false, message: "Address is in wrong format" })
        }
        if (address) {
                if (!validations.isValid(address.street)) {
                    return res.status(400).send({ status: false, message: "Street address cannot be empty" });
                }
                if (!validations.isValid(address.city)) {
                    return res.status(400).send({ status: false, message: "City cannot be empty" });
                }
                if (!validations.isValid(address.pincode)) {
                    return res.status(400).send({ status: false, message: "Pincode cannot be empty" });
                }
                let pincode = address.pincode;

                if (!/^[1-9][0-9]{5}$/.test(pincode)) return res.status(400).send({ status: false, msg: " Please Enter Valid Pincode Of 6 Digits" });


            }
            let saveData = await userModel.create(req.body);
            return res.status(201).send({ status: true, message: "success", data: saveData });
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: false, message: error.massage });
    }
}


//=============================== LOGIN USER  ===============================

const loginUser = async function (req, res) {
    try {
        let userEmail = req.body.email;
        let password = req.body.password;

        if (!userEmail) {
            return res.status(400).send({ status: false, massage: "Please enter userEmail" });
        };
        if (!validations.isValid(userEmail)) {
            return res.status(400).send({ status: false, message: "Email Value Empty" });
        };
        if (!password) {
            return res.status(400).send({ status: false, massage: "Please enter  password" });
        };
        if (!validations.isValid(password)) {
            return res.status(400).send({ status: false, message: "password Value Empty" });
        };

        let userData = await userModel.findOne({ email: userEmail, password: password });

        if (!userData) {
            return res.status(401).send({ status: false, massage: "UserEmail and Password is not Correct" });
        };


        let token = jwt.sign(
            {
                userId: userData._id.toString(),
                exp: Math.floor(Date.now() / 1000) + (50 * 60),
                iat: Math.floor(Date.now() / 1000)
            }  , "project-booksManagementGroup55");

        res.setHeader("x-api-key", token);

        let data = {
            token: token,
            userId: userData._id.toString(),
            exp: Math.floor(Date.now() / 1000) + (50 * 60),
            iat: Math.floor(Date.now() / 1000)

        };


        return res.status(200).send({ status: true, message: "User logged in successfully", data: data });

    } catch (error) {
        console.log(error.message);
        return res.status(500).send({ status: false, massage: error.massage });
    }
};


module.exports = { userCreate, loginUser }

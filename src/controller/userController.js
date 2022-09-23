const userModel = require('../Models/userModel');
const validations = require('../validation/validation.js');
const jwt =require('jsonwebtoken')


// =================================== CREATE USER ==================================

const userCreate = async function (req, res) {
    try {

        let { title, name, phone, email, password, address, } = req.body;

        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, msg: "Body is empty, please Provide data" });
        };
        if (!title) {
            return res.status(400).send({ status: false, massage: "Title is required" });
        };
        if (!["Mr", "Mrs", "Miss"].includes(title) && !validations.isValid(title)) {
            return res.status(400).send({ status: false, massage: "Title is in wrong format" });
        };
        if (!name) {
            return res.status(400).send({ status: false, massage: "Name is required" });
        };
        if (!validations.isValid(name)) {
            return res.status(400).send({ status: false, massage: "Name is Empty" });
        };
        if (!/^[ a-z ]+$/i.test(name)) {
            return res.status(400).send({ status: false, massage: "Name is in wrong formet" });
        };
        if (!phone) {
            return res.status(400).send({ status: false, massage: "Phone is required" });
        };
        if (!/^[789]\d{9}$/.test(phone.trim())) {
            return res.status(400).send({ status: false, massage: "Please enter a valid phone number" });
        };

        let duplicatePhone = await userModel.findOne({ phone: phone });
        if (duplicatePhone) {
            return res.status(400).send({ status: false, message: "Phone No. already exists!" });
        };
        if (!email) {
            return res.status(400).send({ status: false, massage: "Email is required" });
        };
        if (!validations.isValid(email)) {
            return res.status(400).send({ status: false, massage: "Email is Empty" });
        };
        if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email.trim())) {
            return res.status(400).send({ status: false, massage: "Email is invalid formet" });
        };

        let duplicateEmail = await userModel.findOne({ email: email });
        if (duplicateEmail) {
            return res.status(400).send({ status: false, message: "Email already exists!" });
        };
        if (!password) {
            return res.status(400).send({ status: false, massage: "Password is requires" });
        };
        if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(password)) {
            return res.status(400).send({ status: false, massage: " Password should be 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter" });
        };
        // if (!address) {
        //     return res.status(400).send({ status: false, massage: "Address is required" });
        // };
        if (address && typeof address != "object") {
            return res.status(400).send({ status: false, message: "Address is in wrong format" });
        };
        // if (!address.street) {
        //     return res.status(400).send({ status: false, message: "Street is required" });
        // };
        if (!validations.isValid(address.street)) {
            return res.status(400).send({ status: false, message: "Street is Empty" });
        };
        // if (!address.city) {
        //     return res.status(400).send({ status: false, message: "City is required" });
        // };
        if (!validations.isValid(address.city)) {
            return res.status(400).send({ status: false, message: "City is  Empty" });
        };
        // if (!address.pincode) {
        //     return res.status(400).send({ status: false, message: "Pincode is required" });
        // };
        if (!/^[1-9][0-9]{5}$/.test(address.pincode.trim())) {
            return res.status(400).send({ status: false, massage: "Pincode is invalid formet" });
        }

        let saveData = await userModel.create(req.body);
        return res.status(201).send({ status: true, massage: "success", data: saveData });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ status: false, massage: error.massage });
    }
};


//=============================== LOGIN USER  ===============================

const loginUser = async function (req, res) {
    try {
        let userEmail = req.body.email;
        let password = req.body.password;

        if (!userEmail && !password)
            return res.status(400).send({ status: false, massage: "please enter username and password" });

        let userData = await userModel.findOne({ email: userEmail, password: password });
        if (!userData)
            return res.status(400).send({ status: false, massage: "UserEmail and Password is not Correct" });

        let token = jwt.sign({
            userId: userData._id.toString(),
            batch: "plutonium",
            organization: "FunctionUp",

        },
            "project-booksManagementGroup59", {

            expiresIn: "24h" // expires in "24h"
        }
        );

        return res.status(200).send({ status: true, message: "User logged in successfully" , data:token });

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, massage: error.massage });
    }
};




module.exports = { userCreate, loginUser };

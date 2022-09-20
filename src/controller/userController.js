const userModel = require('../Models/userModel');
const Validations = require('../validation/validation.js');

// =========== CREATE USER =====================

const userCreate = async function (req, res) {
    try {
        let userData = req.body;
        let { title, name, phone, email, password, address, } = userData;
        if (!title)
            return res.status(400).send({ status: false, massage: "title is required" });
        if (!Validations.isValidUserTitle(title))
            return res.status(400).send({ status: false, massage: "Title is in wrong format" });
        

       if (!name)
            return res.status(400).send({ status: false, massage: "name is required" });
        if (Validations.isValidUserName(name))
            return res.status(400).send({ status: false, massage: "Name should be alphabet" });
        if (!phone)
            return res.status(400).send({ status: false, massage: "phone is required" });
        if (Validations.isValidUserPhone(phone))
            return res.status(400).send({ status: false, massage: "Phone is in wrong formet" });
        if (!email)
            return res.status(400).send({ status: false, massage: "email is required" });
        if (Validations.isValidUserEmail(email))
            return res.status(200).send({ status: false, massage: "Email is in wrong formet" });
        if (!password)
            return res.status(400).send({ status: false, massage: "password is requires" });
        if (Validations.isValidPassword(password))
            return res.status(400).send({ status: false, massage: "Password is in worng formet" });
        if (!address)
            return res.status(400).send({ status: false, massage: "address is required" });

        let saveData = await userModel.create(userData);
        return res.status(201).send({ status: true, massage: "success", data: saveData });
    } catch (error) {
        return res.status(500).send({ status: true, massage: error.massage });
    }
};


//===========LOGIN USER===========================

const loginUser = async function (req, res) {
    try {
        let UserName = req.body.email;
        let Password = req.body.password;

        if (!UserName && !Password)
            return res.status(400).send({ status: false, massage: "please enter username and password" });
        let saveData = await userModel.findOne({ email: userName, password: password });
        if (!saveData)
            return res.status(400).send({ status: false, massage: "UserName and Password is not Correct" });


        let token = jwt.sign({
            UserId: UserName._id.toString(),
            batch: "plutonium",
            organisation: "FunctionUp",

        },
            "project-booksManagementGroup59"
        );
        return res.status(200).send({ status: true, token: token });
    } catch (error) {
        return res.status(500).send({ status: false, massage: error.massage });
    }
};





module.exports.userCreate = userCreate;
module.exports.loginUser = loginUser;
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const tokenVerification = async (req, res, next) => {
    try {
        //---------------------------header verification---------------------------
        let token = req.headers["x-Auth-token"];
        if (!token) token = req.headers["x-auth-token"];
        if (!token) return res.send({ status: false, msg: "token must be present" });
        //---------------------------token verification------------------------------
        const decodedToken = jwt.verify(token, "Prabhas Prasad");
        if (!decodedToken) return res.send({ status: false, msg: "token is invalid" });
        //---------------------------finding user------------------------------
        const userId = req.params.userId;
        const user = await userModel.findById(userId);
        if (!user) return res.send({ status: false, msg: "No such user exists" });
        //---------------------------authorization user----------------------------
        if (userId != decodedToken.userId) return res.send({ status: false, msg: "Unauthorized person" });
        //---------------------------isDeleted true--------------------------------
        const user1 = await userModel.findById(userId).select({ isDeleted: 1, _id: 0 });
        if (user1.isDeleted == true) return res.send({ status: true, msg: "User has been deleted" });
        next()
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({ error: err.message })
    }
}

module.exports = { tokenVerification }
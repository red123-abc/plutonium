const UserModel= require("../models/userModel")




const basicCode= async function(req, res, next) {
    let tokenDataInHeaders= req.headers.token
    console.log(tokenDataInHeaders)

    console.log( "HEADER DATA ABOVE")
    console.log( "hey man, congrats you have reached the Handler")
    //res.send({ msg: "This is coming from controller (handler)"})
    next()
    }

const createUser= async function (req, res) {
    
    let data= req.body
    let tokenDataInHeaders= req.headers.token
    //Get all headers from request
    console.log("Request headers before modificatiom",req.headers)
    //Get a header from request
    console.log(req.headers.batch)
    console.log(req.headers["content-type"])
    console.log(tokenDataInHeaders)
    //Set a header in request
    req.headers['month']='June' //req.headers.month = "June"

    //Set an attribute in request object
    req.anything = "everything"
    
    
    console.log("Request headers after modificatiom",req.headers)
    
    //Set a header in response
    res.header('year','2022')
    res.send({msg: "Hi"})
}

const getUsersData= async function (req, res) {
    let allUsers= await UserModel.find()
    res.send({msg: allUsers})
}

const feeds = async function(req, res, next) {
    console.log("feeds")
    next()
    }

const profileDetails = async function(req, res, next) {
    console.log("profileDetils")
    next()
    }

const friendList = async function(req, res, next) {
        console.log("friendList")
        next()
        }

const changePassword = async function(req, res, next) {
    console.log("changePassword")
    next()
    }

const termsAndConditions = async function(req, res, next) {
    console.log("termsAndConditions")
    next()
    }

const register = async function(req, res, next) {
    console.log("register")
    next()
    }    

module.exports.createUser= createUser
module.exports.getUsersData= getUsersData
module.exports.basicCode= basicCode

module.exports.feeds = feeds
module.exports.profileDetails = profileDetails
module.exports.friendList = friendList
module.exports.changePassword = changePassword
module.exports.termsAndConditions = termsAndConditions
module.exports.register = register


const { count } = require("console")
const AuthorModel= require("../models/authorModel")
const BookModel = require("../models/bookModel")


// Creating Author Schema: 

const createAuthor= async function (req, res) {
    let data= req.body
    let savedData= await AuthorModel.create(data)
    res.send({msg: savedData})
}

//Problem Statement 2:

const getAuthorsData= async function (req, res) {
    let savedData = await AuthorModel.find({author_name: "Chetan Bhagat"}).select("author_id")
    let bookdata = await BookModel.find({author_id: savedData[0].author_id})
    res.send({msg: bookdata})
}




module.exports.createAuthor= createAuthor

module.exports.getAuthorsData= getAuthorsData
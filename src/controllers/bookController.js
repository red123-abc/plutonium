// const { count } = require("console")
// const BookModel= require("../models/bookModel")

// const createBook= async function (req, res) {
//     let data= req.body

//     let savedData= await BookModel.create(data)
//     res.send({msg: savedData})
// }

// const getBooksData= async function (req, res) {
//     let allBooks= await BookModel.find( {authorName : "HO" } )
//     console.log(allBooks)
//     if (allBooks.length > 0 )  res.send({msg: allBooks, condition: true})
//     else res.send({msg: "No books found" , condition: false})
// }


// const updateBooks= async function (req, res) {
//     let data = req.body // {sales: "1200"}
//     // let allBooks= await BookModel.updateMany( 
//     //     { author: "SK"} , //condition
//     //     { $set: data } //update in data
//     //  )
//     let allBooks= await BookModel.findOneAndUpdate( 
//         { authorName: "ABC"} , //condition
//         { $set: data }, //update in data
//         { new: true , upsert: true} ,// new: true - will give you back the updated document // Upsert: it finds and updates the document but if the doc is not found(i.e it does not exist) then it creates a new document i.e UPdate Or inSERT  
//      )
     
//      res.send( { msg: allBooks})
// }

// const deleteBooks= async function (req, res) {
//     // let data = req.body 
//     let allBooks= await BookModel.updateMany( 
//         { authorName: "FI"} , //condition
//         { $set: {isDeleted: true} }, //update in data
//         { new: true } ,
//      )
     
//      res.send( { msg: allBooks})
// }




// // CRUD OPERATIONS:
// // CREATE
// // READ
// // UPDATE
// // DELETE



// module.exports.createBook= createBook
// module.exports.getBooksData= getBooksData
// module.exports.updateBooks= updateBooks
// module.exports.deleteBooks= deleteBooks


//================================================== Assignment Solution ================================================

const { count } = require("console")
const AuthorModel = require("../models/authorModel")
const BookModel= require("../models/bookModel")

// Creating Book Schema
const createBook= async function (req, res) {
    let data= req.body
    let savedData= await BookModel.create(data)
    res.send({msg: savedData})
}

// Problem Statement 3
const getBooksData= async function (req, res) {
    let savedData= await BookModel.findOneAndUpdate({book_name: "Two states"},{$set: {price: 100}},{new : true})
    let authordata = await AuthorModel.find({author_id: savedData.author_id}).select("author_name")
    let price = savedData.price
    res.send({msg: authordata, price})
}

// Problem Statement 4 

const respondBack = async function(req, res){

   const data = await BookModel.find( { price : { $gte: 50, $lte: 100} } ).select({author_id: 1, _id:0})
   const key = data.map(inp => inp.author_id)
   let temp = []

   for(let i=0; i<key.length; i++){
    let x = key[i]
    const author = await AuthorModel.find({author_id: x}).select({author_name:1, author_id: 1 ,_id:0})
    temp.push(author)
   }
   const authorName= temp.flat()
   res.send({msg: authorName})
}


module.exports.createBook = createBook

module.exports.getBooksData = getBooksData

module.exports.respondBack = respondBack
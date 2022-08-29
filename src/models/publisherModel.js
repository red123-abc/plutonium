const mongoose=require('mongoose')
const publisherSchema=new mongoose.Schema({
name:String,
headQuarter:String
})

module.exports=mongoose.model("Publisher",publisherSchema)
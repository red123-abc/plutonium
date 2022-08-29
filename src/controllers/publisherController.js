const publisherModel=require('../models/publisherModel')

const createPub=async function(req,res){
    let data=req.body
    const publishers=await publisherModel.create(data)
    res.send({msg:publishers})
}

// const getPublisherData= async function (req, res) {
//     let publisher = await publisherModel.find()
//     res.send({data: publisher})
// }
// module.exports.createPub= createPub
module.exports.createPub=createPub
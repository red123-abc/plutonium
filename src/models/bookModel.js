const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema( {
    name: String,
    authorId: {
        type: ObjectId,
        ref: "Author"
    }, 
    price: Number,
    ratings: Number,
    publisherId: {
        type: ObjectId,
        ref: "Publisher"
},
isHardCover:{
    type:Boolean,
    default:false
}


}, { timestamps: true });


module.exports = mongoose.model('LibraryBook', bookSchema)

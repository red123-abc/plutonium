const mongoose = require("mongoose");
const userModel = require("./userModel");
const ObjectId = mongoose.Schema.Types.ObjectId;

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    userId: {
      type: ObjectId,
      required: true,
      ref: "User",
    },
    ISBN: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    subcategory: {
      type: [String],
      required: true,
    },
    reviews: {
      type: Number,
      default: 0,
    }, //"Holds number of reviews of this book"
    deletedAt: {
      type: Date,
    }, //"when the document is deleted"
    isDeleted: { type: Boolean, default: false },
    releasedAt: { type: Date, required: true }, //format("YYYY-MM-DD")
  },
  { timestamps: true }
);

module.exports = mongoose.model("book", bookSchema);

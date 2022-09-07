const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    body: {
      type: String,
      required: true
    },

    authorId: {
      type: ObjectId,
      ref: "P-Author",
      requiredPaths: true
    },

    tags: [{ type: String, trim: true }],

    category: {
      type: String,
      required: true
    },

    subcategory: [{ type: String, trim: true }],

    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date,
    },
    publishedAt: {
      type: Date
    },
    isPublished: {
      type: Boolean,
      default: false
    },
 },{ timestamps: true });

module.exports = mongoose.model('P-Blogs', blogSchema)
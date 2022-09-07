const mongoose = require("mongoose");
const blogModel = require("../models/blogModel")

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId)
}
// ....................................create  Blog................................................................

const createBlog = async function (req, res) {
  try {
    let author_id = req.body.authorId
    let blog = req.body
    if (!blog.title) return res.status(400).send({ msg: "title is required" })
    if (!blog.body) return res.status(400).send({ msg: "body is required" })
    if (!blog.category) return res.status(400).send({ msg: "category is required" })
    if (!isValidObjectId(author_id)) return res.status(404).send({ msg: " author id is not valid" })

    let blogCreated = await blogModel.create(blog)
    return res.status(201).send({ data: blogCreated })

  } catch (err) {
    console.log("This is the error:", err.message)
    res.status(500).send({ msg: "Error", error: err.message })

  }
}
// ...............................................................get Blog..................................................................

const getBlog = async function (req, res) {

  try {
    let authorId = req.query.authorId
    let category = req.query.category
    let tags = req.query.tags
    let subcategory = req.query.subcategory

    let blog = {
      isDeleted: false,
      isPublished: true
    }

    if (authorId) {
      blog.authorId = authorId
    }
    if (category) {
      blog.category = category
    }
    if (tags) {
      blog.tags = tags
    }
    if (subcategory) {
      blog.subcategory = subcategory
    }

    let savedData = await blogModel.find(blog)
    if (savedData.length == 0) {
      return res.status(400).send({ status: false, msg: "No such Blogs Available" })
    } else {
      return res.status(200).send({ status:true,data: savedData })
    }
  } catch (err) {
    res.status(500).send({ msg: err.message })
  }
}


// ...............................................................update Blog.....................................................



const updatedBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    let data = req.body;
    if (Object.keys(data).length == 0) return res.status(404).send({status: false, msg: "Please include atleast one properties to be updated"});
    let blog = await blogModel.findById(blogId);
    console.log(blog)
    if (Object.keys(blog).length == 0) {
      return res.status(404).send({status: false, msg:"No such blog found"});
    }
    if(!blog.isDeleted==false)
    return res.status(404).send({status:false,msg:"document not found"})
    if (data.title) blog.title = data.title;
    if (data.category) blog.category = data.category;
    if (data.body) blog.body = data.body;
    if (data.tags) {
      blog.tags.push(data.tags);
    }
    if (data.subcategory) {
      blog.subcategory.push(data.subcategory);
    }
    blog.isPublished = true;
    blog.publishedAt = Date.now();
    let updateData = await blogModel.findOneAndUpdate({ _id: blogId }, blog, {
      new: true,
    });
    
    res.status(200).send({ status:true,data: updateData });
  } catch (err) {
    res.status(500).send({ msg: "Error", error: err.message });
  }
};
// .........................................................delete by blog Id......................................................

const deletedBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    let blog = await blogModel.findById(blogId);
    if (!blog) return res.status(404).send({ msg: "not found" })
    if(!blog.isDeleted==false)
    return res.status(404).send({msg:"document has been deleted"})

    // blogData = req.body
    let deletedBlog = await blogModel.findOneAndUpdate({ _id: blogId }, {
      $set: {
        isDeleted: true, deletedAt: Date()
      }
    }, { new: true });
    res.status(200).send({ status: true, data: deletedBlog });

  } catch (err) {
    console.log("This is the error:", err.message)
    res.status(500).send({ msg: "Error", error: err.message })
  }

}

// // ............................................................delete by query .................................................................
const deleteBlogByQuery = async function (req, res) {
  try {
      let query = req.query
      if (Object.keys(query).length == 0) {
          return res.status(400).send({ status: false, msg: "Query Params cannot be empty" })
      }

      let deleteBlogs = await blogModel.updateMany({authorId: query.authorId, isDeleted: false}, { $set: { isDeleted: true, deletedAt: Date.now() } })
      if (deleteBlogs.matchedCount == 0) {
          return res.status(404).send({ status: false, msg: "Blog Not Found" })
      }
      
      res.status(200).send({ status: true, msg: "Document is deleted" })
  } catch (error) {
      console.log(error);
      res.status(500).send({ status: false, msg: error.message })
  }
}











// const deletebyquery = async function (req, res) {
//   try {

//     if (Object.keys(req.query).length == 0) {
//         return res.status(400).send({ status: false, msg: "atleast one query must be there" })
//     }
//     let authorId = req.query.authorId
//     console.log(authorId)
//     let category = req.query.category
//     let tags = req.query.tags
//     let subcategory = req.query.subcategory
//     let isPublished = req.query.isPublished
//     if (!authorId) return res.status(400).send({ status: false, msg: "authorId must be present" })
//     const tokenId = req.decodedToken.authorId
//     console.log(req.decodedToken)
//     if (authorId !== tokenId) {
//       return res.status(403).send({status:false,
//         msg: 'FORBIDDEN',
//         error: 'User logged is not allowed to modify the requested users data',
//     });
      
//     }
 
//     let blog = {

//     }
//     if (authorId) {
//       blog.authorId = authorId
//     }
//     if (category) {
//       blog.category=category
//     }
//     if (tags) {
//       blog.tags = tags
//     }
//     if (subcategory) {
//       blog.subcategory = subcategory
//     } if (isPublished) {
//       blog.isPublished = isPublished
//     }

    

//     let data = await blogModel.updateMany(blog, {
//       $set: {
//         isDeleted: true, deletedAt: new Date()
//       }
//     });
//     if (!data) return res.status(400).send({ msg: "updated data not found" })


//     res.status(200).send({ status: true ,data:data})
//   }
//   catch (err) {
//     console.log("This is the error:", err.message)
//     res.status(500).send({ msg: "Error", error: err.message })
//   }
// }


module.exports.createBlog = createBlog;
module.exports.getBlog = getBlog;
module.exports.updatedBlog = updatedBlog
module.exports.deletedBlog = deletedBlog
module.exports.deleteBlogByQuery = deleteBlogByQuery

// User
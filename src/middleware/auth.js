const jwt = require('jsonwebtoken');
const blogModel = require('../Models/bookModel.js');
const mongoose = require('mongoose');


// ========================= Authentication =====================

const authentication = function (req, res, next) {

       try {
              let token = req.headers["x-api-key"];
              if (!token) {
                     return res.status(400).send({ status: false, message: "token is required" });
              }

              const validToken = jwt.decode(token);
              if (validToken) {
                     jwt.verify(token, "project-booksManagementGroup59", (error) => {
                            if (error) {
                                   // console.log("Auth error", err); 
                                   return res.status(400).send({ status: false, message: 'Token is Not Valid' });
                            }
                            next();
                     });
              }
       } catch (error) {
              console.log('This is the error :', error.message);
              return res.status(500).send({ status: false, message: error.message });
       }

};

// ========================Authorization========================

const authorizations = async function (req, res, next) {
       try {
              const bookId = req.params.bookId;

              if (!mongoose.Types.ObjectId.isValid(bookId)) {
                     return res.status(400).send({ status: false, message: "please provided valid book_id" });
              };
              const findBook = await blogModel.findOne({ _id: bookId, isDeleted: false });

              if (!findBook) {
                     return res.status(404).send({ status: false, msg: "No book found " });
              };
              const token = req.headers["x-api-key"];
              const decodedToken = jwt.verify(token, "project-booksManagementGroup59");

              if (decodedToken.userId == findBook.userId) {
                     next();
              } else {
                     res.status(401).send({ status: false, message: "You are not authorized" });
              };
       }
       catch (error) {
              console.log('This is the error :', error.message);
              res.status(500).send({ status: false, error: error.message });
       }
};

// Destructuring
module.exports = { authentication, authorizations };




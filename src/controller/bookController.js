const bookModel = require('../Models/bookModel');
const mongoose = require('mongoose');
const validations = require('../validation/validation.js');

// ================================ Create book ==========================
const createBook = async function (req, res) {
     try {
          let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = req.body;
          // check body present or not
          if (Object.keys(req.body).length === 0) {
               return res.status(400).send({ status: false, message: "In req body data must be present" });
          }
          // title validation
          if (!title) {
               return res.status(400).send({ status: false, message: "title is required field" });
          }
          if (! /^\w[A-Za-z0-9\s\-_,\.;:()]+$/.test(title)) {
               return res.status(400).send({ status: false, message: "title is not in valid format" });
          }
          if (!excerpt) {
               return res.status(400).send({ status: false, message: "expert key is required field" });
          }
          if (! /^\w[a-zA-Z\.]+/.test(excerpt)) {
               return res.status(400).send({ status: false, message: " excerpt text is invalid it must be alphabet" });
          }
          if (!userId) {
               res.status(400).send({ status: false, message: "userId must be present" });
          }
          if (!mongoose.isValidObjectId(userId)) {
               return res.status(400).send({ status: false, message: "enter valid  userId " });
          }
          if (!ISBN) {
               return res.status(400).send({ status: false, message: "ISBN is required field " });

          }
          if (! /\x20*(?=.{17}$)97(?:8|9)([ -])\d{1,5}\1\d{1,7}\1\d{1,6}\1\d$/.test(ISBN)) {
               return res.status(400).send({ status: false, message: "plz type Isbn in valid format " });
          }
          if (!category) {
               return res.status(400).send({ status: false, message: "category must be present" });
          }
          if (! /^\w[a-zA-Z\.]+/.test(category)) {
               return res.status(400).send({ status: false, message: "category in valid format" });
          }
          if (!subcategory) {
               return res.status(400).send({ status: false, message: "subcategory is required field" });
          }
          if (!/^\w[a-zA-Z\.]+/.test(subcategory)) {
               return res.status.send({ status: false, message: "type subcategory in valid format" });
          }
          if (!releasedAt) {
               return res.status(400).send({ status: false, message: "releasedAt filed is required " });
          }
          if (!validations.isValidReleasedAt(releasedAt)) {
               return res.status(400).send({ status: false, message: " releasedAt  Invalid format" });
          }
          const uniqueTitle = await bookModel.findOne({ title });
          if (uniqueTitle) {
               return res.status(400).send({ status: false, message: "title is alreday exist" });
          }
          const uniqueIsbn = await bookModel.findOne({ ISBN });
          if (uniqueIsbn) {
               return res.status(400).send({ status: false, message: "ISBN is alreday exist" });
          }
          const saveData = await bookModel.create(req.body);
          return res.status(201).send({ status: true, message: 'success', data: saveData });
     } catch (error) {
          console.log(error);
          return res.status(500).send({ status: true, massage: error.massage });
     }
};




// ======================= PUT Api By Params BookId===========================

const updateBook = async function (req, res) {

     try {
          let bookId = req.params.bookId;

          if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
               return res.status(400).send({ status: false, message: "Incorrect Book Id " });
          }
          let book = await bookModel.findById(bookId);

          if (!book || book.isDeleted == true) {
               return res.status(404).send({ status: false, message: "Book not found" });
          }
          if (req.token.bookId !== book.userId) {
               return res.status(403).send({ status: false, message: "Not Authorized" });
          }
          let { title, excerpt, releasedAt, ISBN } = req.body;

          if (title) {
               if (!validations.isValid(title)) {
                    return res.status(400).send({ status: false, message: "Title is Empty" });
               }
          }
          if (! /^\w[A-Za-z0-9\s\-_,\.;:()]+$/.test(title)) {
               return res.status(400).send({ status: false, message: "title is not in valid format" });
          }
          let isDuplicateTitle = await bookModel.findOne({ title: title });

          if (isDuplicateTitle) {
               return res.status(400).send({ status: false, message: `title ${title} already exists!` });
          };
          if (excerpt) {
               if (!validations.isValid(excerpt)){
                    return res.status(400).send({ status: false, message: "Excerpt is Empty" });
               }
          }
          if (ISBN) {
               if (!validations.isValid(ISBN)) {
                    return res.status(400).send({ status: false, message: "ISBN is Empty" });
               }
          }
          if (! /\x20*(?=.{17}$)97(?:8|9)([ -])\d{1,5}\1\d{1,7}\1\d{1,6}\1\d$/.test(ISBN)) {
               return res.status(400).send({ status: false, message: "Enter the valid ISBN" });
          }
          let isDuplicateISBN = await bookModel.findOne({ ISBN: ISBN });

          if (isDuplicateISBN) {
               return res.status(400).send({ status: false, message: `ISBN ${ISBN} already exists!` });
          };
          if (releasedAt) {
               if (!validations.isValid(releasedAt)) {
                    return res.status(400).send({ status: false, message: "releasedAt is Empty" });
               }
          }
          if (!validations.isValidReleasedAt(releasedAt)) {
               return res.status(400).send({status: false, message: "Required (YYYY-MM-DD)"
               });
          }

          let updateBook = await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { title, excerpt, releasedAt, ISBN } });
          return res.status(200).send({ status: true, message: "Success", data: updateBook });


     } catch (error) {
          console.log(error)
               return res.status(500).send({ status: false, message: error.message });
          }
     }



// , { new: true }

module.exports = { createBook };


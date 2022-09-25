const reviewModel = require('../Models/reviewModel');
const bookModel = require('../Models/bookModel');
const mongoose = require("mongoose");
const validations = require('../validation/validation.js');

// =========================Create Review ==========================
const createReview = async function (req, res) {
    try {

        let data = req.body;
        let bookId = req.params.bookId;
        let { reviewedAt, rating } = data;

        if (!reviewedAt) {
            return res.status(400).send({ status: false, msg: "reviewdAt is required" });
        }
        if (!rating) {
            return res.status(400).send({ status: false, msg: "rating is required" });
        }
        if (!mongoose.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Id is Not Valid" });
        }
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Please enter the data in the request body to update" });
        }
        data.bookId = bookId;

        let checkBookId = await bookModel.findOne({ _id: bookId, isDeleted: false });

        if (!checkBookId) {
            return res.status(404).send({ status: false, message: "Book doesn't exist" });
        }
        if (data.reviewedBy !== undefined) {
            if (!validations.isValid(data.reviewedBy)) {
                return res.status(400).send({ status: false, message: "Name shouldn't be blank" });
            }
        }
        if (!validations.alphabetTestOfString(data.reviewedBy)) {
            return res.status(400).send({ status: false, message: "Enter a valid name" });
        }
        data.reviewedAt = Date.now();

        if (data.review !== undefined) {
            if (!validations.isValid(data.review)) {
                return res.status(400).send({ status: false, message: "Write review properly" });
            }
        }
        if (!data.rating) {
            return res.status(400).send({ status: false, message: "You must give rating of this book." });
        }
        if (typeof data.rating != 'number' || data.rating < 1 || data.rating > 5) {
            return res.status(400).send({ status: false, message: 'Rating should be a number between 1 to 5' });
        }

        const updatedBooks = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: 1 } }, { new: true });

        let createdReview = await reviewModel.create(data);
        let updatedBooksdata = { updatedBooks };

        updatedBooksdata.reviewsData = createdReview;

        return res.status(201).send({ status: true, message: 'Success', data: updatedBooksdata });
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};

// =================================  Put review =============================
const updateReviewBookByBookid = async function (req, res) {

    try {
        let bookId = req.params.bookId;
        let reviewId = req.params.reviewId;

        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, msg: "Book_id is not valid" });
        }
        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).send({ status: false, msg: "review_id is not valid" });
        }
        let { review, rating, reviewedBy } = req.body;

        let bookData = await bookModel.findOne({ _id: bookId, isDeleted: false });

        if (!bookData) {
            return res.status(404).send({ status: false, msg: "Book might be deleted or its not present" });
        }

        let findReviewAndUpdate = await reviewModel.findOneAndUpdate({ _id: reviewId, bookId: bookId, isDeleted: false }, { reviewedBy: reviewedBy, rating: rating, review: review }, { new: true }).select({ createdAt: 0, updatedAt: 0, _id: 0 });

        if (!findReviewAndUpdate) {
            return res.status(404).send({ status: false, msg: "Document not found it must be deleted or incorrect" });
        }

        let finalData = {
            title: bookData.title, excerpt: bookData.excerpt, userId: bookData.userId,
            category: bookData.category, subcategory: bookData.subcategory, isDeleted: false, reviews: bookData.reviews,
            reviewsData: findReviewAndUpdate
        };

        res.status(200).send({ status: true, message: "Data updated Successfully", Data: finalData });

    }
    catch (error) {
        console.log(error);
        res.status(500).send({ status: false, message: error.message });

    }
};

// ================================== DELETE REVIEW ==========================
const deleteBookReview = async function (req, res) {

    try {
        const reviewId = req.params.reviewId;
        const bookId = req.params.bookId;

        if (!mongoose.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, msg: 'Please enter valid bookId' });
        }
        if (!mongoose.isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, msg: 'Please enter valid reviewsId' });
        }
        let book = await bookModel.findById(bookId);

        if (!book || book.isDeleted === true) {
            return res.status(404).send({ status: false, message: "This book is not present in DB" });
        }
        let review = await reviewModel.findById(reviewId);

        if (!review || review.isDeleted === true) {
            return res.status(404).send({ status: false, message: "This review is not present in review DB" });
        }

        await reviewModel.findOneAndUpdate({ _id: reviewId }, { isDeleted: true, deletedAt: new Date() }, { new: true });

        await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: -1 } }, { new: true });

        return res.status(200).send({ status: true, message: "review successfuly Deleted" });

    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ status: false, message: error.message });
    }
};

module.exports = { createReview, updateReviewBookByBookid, deleteBookReview };

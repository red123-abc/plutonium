const mongoose = require('mongoose');


const isValidObjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId);
};
const isValidEmail = function (value) {
    if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(value)) { return true }
    else return false
}

const isValidPassword = function (value) {
    if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(value)) {
        return true
    } else {
        return false
    }

}

//validation for fname and lname

const validChar = function (value) {
    if (/^[a-zA-Z]*$/.test(value)) {
        return true
    } else {
        return false
    }
}

// validation for blog title
const validBlogTitle = function (value) {
    if (/^[a-z\d\-_\s]+$/i.test(value)) {
        return true
    } else {
        return false
    }
}

// validation for author title
const validAuthorTitle = function (value) {
    if (["Mr", "Mrs", "Miss"].includes(value)) {
        return true
    } else {
        return false
    }
}

// module.exports.isValidObjectId = isValidObjectId
// module.exports.isValidEmail = isValidEmail
// module.exports.isValidPassword = isValidPassword
// module.exports.validChar = validChar
// module.exports.validBlogTitle = validBlogTitle
// module.exports.validAuthorTitle = validAuthorTitle

module.exports={isValidObjectId,isValidEmail,isValidPassword,validChar,validBlogTitle,validAuthorTitle}


//=========== VALIDATION CREATE USER =====================;

const isValid = function (value) {
          if (typeof value !== "string") return false;
          if (typeof value === 'string' && value.trim().length === 0) return false;
          return true;
};

const alphabetTestOfString = function (value) {
    if (!/^[A-Za-z ]+$/.test(value)) {
    return false
}
return true
}



// Destructuring 
module.exports = {  isValid,alphabetTestOfString };


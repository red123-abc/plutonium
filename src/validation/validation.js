
<<<<<<< HEAD
//=========== VALIDATION CREATE USER =====================;

const isValid = function (value) {
          if (typeof value !== "string") return false;
          if (typeof value === 'string' && value.trim().length === 0) return false;
          return true;
};


         


// Destructuring 
module.exports = { isValid };

=======
// validation for  User  title of enum
const isValidUserTitle = function (value) {
          if (["Mr", "Mrs", "Miss"].includes(value)) {
                    return true;
          } else {
                    return false;
          }
}
       
//validation for Name
const isValidUserName = function (value) {
          if (/^ [a - zA - Z] + [a - zA - Z] + $ /.test(value)) {
                    return true;
          } else {
                    return false;
          }
};

// Validation for phone
const isValidUserPhone = function (value) {
          if (/^[987]{1})(\d{1}\d{8})/.test(value)) {
                    return true;
          } else {
                    return false;
          }
};
// Validation for Email
const isValidUserEmail = function (value) {
          if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(value)) {
                    return true;
          } else {
                    return false;
          }

};
// Validation for Password
const isValidPassword = function (value) {
          if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(value)) {
                    return true;
          } else {
                    return false;
          }

};
// bookController reviews validation
const isValidReleasedAt = function(value){
    if(! /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(value)){
        return true;
    }
    else{
        return false
    }

}

// Destructuring 
module.exports = { isValidUserTitle,isValidUserName, isValidUserPhone, isValidUserEmail, isValidPassword,isValidReleasedAt };
>>>>>>> 0de546581f8078a88570cf4b0518c72b19799607

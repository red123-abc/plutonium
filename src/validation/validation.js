
//=========== VALIDATION CREATE USER =====================;


// validation for User title
// const isValidUserTitle = function (value) {
//           if (/^[a-z\d\-_\s]+$/i.test(value)) {
//                     return true;
//           } else {
//                     return false;
//           }
//           if (["Mr", "Mrs", "Miss"].includes(value)) {
//                     return true;
//           } else {
//                     return false;
//           }

// };

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



// Destructuring 
module.exports = { isValidUserTitle,isValidUserName, isValidUserPhone, isValidUserEmail, isValidPassword };
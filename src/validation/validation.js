
//=========== VALIDATION CREATE USER =====================;

const isValid = function (value) {
          if (typeof value !== "string") return false;
          if (typeof value === 'string' && value.trim().length === 0) return false;
          return true;
};


         


// Destructuring 
module.exports = { isValid };


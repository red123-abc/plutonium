const bcrypt = require("bcrypt")

bcrypt.genSalt(10, (err, salt) => {
    console.log(err,salt)
    // bcrypt.hash(plaintextPassword, salt, function(err, hash) {
    //     // Store hash in the database
    // });
})
bcrypt.hash("pass",10).then((result)=>console.log(result))
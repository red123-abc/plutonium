const jwt = require("jsonwebtoken");
const authorModel = require("../models/authorModel")
const VALIDATOR = require("../validator/validate")

//.....................................................................create Author................................................

const createAuthor = async function (req, res) {

  try {

    let data = req.body
    if (Object.keys(data).length === 0) return res.status(400).send({ msg: "Request body is required" })
    if (!data.fname) return res.status(400).send({ msg: "fname is required" })
    if (!data.lname) return res.status(400).send({ msg: "lname is required" })
    if (!data.title) return res.status(400).send({ msg: "title is required" })
    if (!data.email) return res.status(400).send({ msg: "email is required" })
    if (!data.password) return res.status(400).send({ msg: "password is required" })

    let fname = req.body.fname
    if (!VALIDATOR.validChar(fname))
      return res.status(400).send({ msg: "fname should be alphabet" })

    let lname = req.body.lname
    if (!VALIDATOR.validChar(lname))
      return res.status(400).send({ msg: "lname should be alphabet" })

    let title = data.title
    if (!VALIDATOR.validAuthorTitle(title))
      return res.status(400).send({ msg: "Title should be Mr,Mrs and Miss" })

    let email = req.body.email
    if (!VALIDATOR.isValidEmail(email))
      return res.status(400).send({ msg: `this mail is not valid ::${email}` })

    let password = req.body.password
    if (!VALIDATOR.isValidPassword(password))
      return res.status(400).send({ msg: `Password should be 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter` })


    let authorCreated = await authorModel.create(data)
    res.status(201).send({ data: authorCreated, msg: "document is created" })

  } catch (err) {
    console.log("This is the error:", err.message)
    res.status(500).send({ msg: "Error", error: err.message })
  }

}


// ...........................................................Login user............................................................

const loginUser = async function (req, res) {
  try {
    let userName = req.body.email;
    let password = req.body.password;
    if (!userName && !password) return res.status(400).send({ msg: "please enter username and password" })
    let author = await authorModel.findOne({ email: userName, password: password });

    if (!author)
      return res.status(400).send({
        status: false,
        msg: "username or the password is not corerct",
      })
    let token = jwt.sign(
      {
        authorId: author._id.toString(),
        batch: "plutonium",
        organisation: "FunctionUp",
      },
      "project-1"
    );
    res.setHeader("x-api-key", token);
    res.status(200).send({ status: true, token: token });
    console.log(token)
  } catch (err) {
    console.log("This is the error:", err.message)
    res.status(500).send({ msg: "Error", error: err.message })
  }

}



module.exports.createAuthor = createAuthor
module.exports.loginUser = loginUser

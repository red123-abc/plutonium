const urlModel = require("../models/urlModel");
const shortid = require("shortid");
const validurl = require("valid-url");
const webhost = "http://localhost:3000/";

const createUrl = async function (req, res) {
  try {
    if (Object.keys(req.body) === 0) {
      return res
        .status(400)
        .send({ status: false, message: "please provide longUrl!!" });
    }

    const longUrl = req.body.longUrl;
    const urlExists = await urlModel.findOne({ longUrl: longUrl });

    if (urlExists) {
      return res.status(200).send({
        status: true,
        message: " url Already Exists",
        data: urlExists,
      });
    }
    const data = {};
    if (validurl.isUri(longUrl)) {
      data.longUrl = longUrl;
    } else {
      return res
        .status(400)
        .send({ status: false, message: "Invalid longUrl. !!" });
    }
    const urlCode = shortid.generate();
    console.log(urlCode);
    data.urlCode = urlCode;

    data.shortUrl = webhost + urlCode;
    const dataCreated = await urlModel.create(data);
    return res.status(201).send({
      status: true,
      message: " ShortUrl created!!!",
      data: dataCreated,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};
const getUrl = async function (req, res) {
  try {
    const urlCode = req.params.urlCode;
    const data = await urlModel.findOne({ urlCode: urlCode });
    if (!data) {
      return res
        .status(400)
        .send({ status: false, message: " urlCode not found!!" });
    }

    if (data) {
      res.redirect(data.longUrl);
    } else {
      res.redirect(webhost);
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { createUrl, getUrl };

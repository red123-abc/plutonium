const urlModel = require("../models/urlModel");
const axios = require("axios");
const shortid = require("shortid");
const validurl = require("valid-url");
const redis = require("redis");
// const { promisify } = require("util");

const redisClient = redis.createClient({
  url: "redis://default:hK7UbOAOQKQcTYBUWZgmhSeR0HkX6I9V@redis-17960.c264.ap-south-1-1.ec2.cloud.redislabs.com:17960",
});
redisClient.connect();
redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});
//Connect to redis
// const redisClient = redis.createClient(
//   17960,
//   "redis-17960.c264.ap-south-1-1.ec2.cloud.redislabs.com",
//   { no_ready_check: true }
// );
// redisClient.auth("hK7UbOAOQKQcTYBUWZgmhSeR0HkX6I9V", function (err) {
//   if (err) throw err.message;
// });
// redisClient.on('error', (err) => console.log('Redis Client Error', err));

//1. connect to the server
//2. use the commands :

//Connection setup for redis

// const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
// const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

const webhost = "http://localhost:3000/";

const createUrl = async function (req, res) {
  try {
    if (Object.keys(req.body).length === 0 || !req.body.longUrl) {
      return res
        .status(400)
        .send({ status: false, message: "please provide longUrl!!" });
    }
    const longUrl = req.body.longUrl;
    const data = {};
    if (validurl.isWebUri(longUrl)) {
      data.longUrl = longUrl;
    } else {
      return res
        .status(400)
        .send({ status: false, message: "Invalid longUrl. !!" });
    }
    let cahcedData = await redisClient.get(`${longUrl}`);
    if (cahcedData) {
      console.log("cached..");
      return res.status(200).send({
        status: true,
        message: " url Already Exists in cache..",
        data: JSON.parse(cahcedData),
      });
    }

    const urlExists = await urlModel
      .findOne({ longUrl: longUrl })
      .select({ urlCode: 1, longUrl: 1, shortUrl: 1 });
    if (urlExists) {
      await redisClient.set(`${urlExists.longUrl}`, JSON.stringify(urlExists));
      return res.status(200).send({
        status: true,
        message: " url Already Exists in db...",
        data: urlExists,
      });
    }
    let accessibleLink = false;
    await axios
      .get(longUrl)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          accessibleLink = true;
        }
      })
      .catch((error) => {
        accessibleLink = false;
      });

    if (accessibleLink == false) {
      return res
        .status(400)
        .send({ status: false, message: "longurl is not accessible!!" });
    }
    const urlCode = shortid.generate().toLowerCase();
    data.urlCode = urlCode;

    data.shortUrl = webhost + urlCode;
    const dataCreated = await urlModel.create(data);
    const response = {
      urlCode: dataCreated.urlCode,
      longUrl: dataCreated.longUrl,
      shortUrl: dataCreated.shortUrl,
    };

    await redisClient.set(`${dataCreated.longUrl}`, JSON.stringify(response));
    return res.status(201).send({
      status: true,
      message: " ShortUrl created!!!",
      data: response,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};
const getUrl = async function (req, res) {
  try {
    const urlCode = req.params.urlCode;
    if (!shortid.isValid(urlCode)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid urlCode!!" });
    }
    // let cahcedData = await GET_ASYNC(`${urlCode}`);
    let cahcedData = await redisClient.get(`${urlCode}`);
    if (cahcedData) {
      console.log("cached..");
      return res.status(302).redirect(cahcedData);
    }
    const data = await urlModel.findOne({ urlCode: urlCode });
    if (!data) {
      return res
        .status(404)
        .send({ status: false, message: " urlCode not found!!" });
    } else {
      // await SET_ASYNC(`${data.urlCode}`, data.longUrl);
      await redisClient.set(`${data.urlCode}`, data.longUrl);
      console.log("dbCall....");
      return res.status(302).redirect(data.longUrl);
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { createUrl, getUrl };

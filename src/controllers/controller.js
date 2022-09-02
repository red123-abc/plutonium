const axios = require('axios')
// -----------------------Get All Memes---------------------
const getAllMemes = async (req, res) => {
  try {
    const options = {
      method: 'get',
      url: 'https://api.imgflip.com/get_memes'
    }
    const result = await axios(options);
    console.log(options);
    const data = result.data
    res.status(200).send({ msg: data, status: true })
  }
  catch (err) {
    res.status(500).send({ msg: err.message })
  }
}
//-----------------------Create All Memes---------------------
const createMeme = async (req, res) => {
  try {
    const template_id = req.query.template_id;
    const text0 = req.query.text0
    const text1 = req.query.text1
    const username = req.query.username;
    const password = req.query.password;
    const options = {
      method: 'post',
      url: `https://api.imgflip.com/caption_image?template_id=${template_id}&text0=${text0}&text1=${text1}&username=${username}&password=${password}`
    }
    const result = await axios(options)
    res.status(200).send({ msg: result.data, status: true })
  }
  catch (err) {
    res.status(500).send({ error: err.message })
  }
}
module.exports = { getAllMemes, createMeme }
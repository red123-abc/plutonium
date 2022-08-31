const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

//-------------------------createUser------------------------------
const createUser = async (req, res) => {
  const data = req.body;
  const savedData = await userModel.create(data);
  res.send({ status: true, msg: savedData });
};
//-------------------------loginUser------------------------------
const loginUser = async (req, res) => {
  const userName = req.body.emailId;
  const password = req.body.password;
  let user = await userModel.findOne({ emailId: userName, password: password });
  //---------------------token generation-------------------------
  if (!user) return res.send({ status: false, msg: "username or the password is not correct" });
  const token = jwt.sign({ userId: user._id.toString(), place: "Panchkula" }, "Prabhas Prasad");
  res.setHeader("x-auth-token", token);
  res.send({ status: true, token: token });
};
//--------------------------getUser-----------------------------
const getUserData = async (req, res) => {
  const userId = req.params.userId;
  const userDetails = await userModel.findById(userId);
  res.send({ status: true, data: userDetails });
};
//-------------------------updateUser------------------------------
const updateUser = async (req, res) => {
  const userId = req.params.userId;
  const userData = req.body;
  const updatedUser = await userModel.findOneAndUpdate({ _id: userId }, userData, { new: true });
  res.send({ status: true, data: updatedUser });
};
//-------------------------deleteUser------------------------------
const deleteUser = async (req, res) => {
  const userId = req.params.userId;
  const updatedUser = await userModel.findOneAndUpdate({ _id: userId }, { $set: { isDeleted: true } }, { new: true });
  res.send({ status: true, data: updatedUser });
};
//-------------------------postMessage------------------------------
const postMessage = async (req, res) => {
  const userId = req.params.userId;
  const post = req.body.post;
  const user = await userModel.findById(userId);
  user.post=[]
  let updatePost = user.post
  updatePost.push(post)
  const postMassage = await userModel.findOneAndUpdate({ _id: userId }, {post: updatePost}, { new: true });
  res.send({ status: true, data: postMassage });
};

module.exports = { createUser, loginUser, getUserData, updateUser, deleteUser, postMessage }
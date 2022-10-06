const express = require("express");
const route = require("./route/route.js");
const mongoose = require("mongoose");
const app = express();



app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://prabhas:Password1*@cluster0.j1kcoh4.mongodb.net/group-29-Database",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});

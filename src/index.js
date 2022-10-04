const express = require("express");
const route = require("./route/route.js");
const mongoose = require("mongoose");
const app = express();



app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://mohitkanwaria_:IZ2vta9qwavx3n0S@cluster0.2byd2qy.mongodb.net/group23Database?retryWrites=true&w=majority",
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

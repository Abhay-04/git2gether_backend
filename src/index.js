const express = require("express");

const { auth } = require("./middlewares/auth");

const dbConnect = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/user", async(req, res) => {
  try {
    const user = new User({
      firstName: "Krishna",
      lastName: "Sharma",
      email: "Krishna@gmail.com",
      gender: "male",
    });

    await user.save();

    res.send("User created successfully");
  } catch (error) {
    console.log(error.message);
  }
});

app.use("/", (err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

dbConnect().then(() => {
  app.listen(3000, () => {
    console.log("Server is running");
  });
});

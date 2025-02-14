const express = require("express");

const dbConnect = require("./config/database");

const cookiesParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const connectionRequestRouter = require("./routes/request");
const profileRouter = require("./routes/profile");

const app = express();

app.use(express.json());
app.use(cookiesParser());

app.use("/", authRouter);
app.use("/", connectionRequestRouter);
app.use("/", profileRouter);

app.use("/", (err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

dbConnect()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running");
    });
  })
  .catch((err) => {
    console.log(err.message);
  });

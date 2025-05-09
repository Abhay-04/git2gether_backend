const express = require("express");

const dbConnect = require("./config/database");
const cors = require("cors");

const cookiesParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const connectionRequestRouter = require("./routes/request");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/user");

const PORT = 3000;

const app = express();

require("dotenv").config();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://git2gether.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookiesParser());

app.use("/", authRouter);
app.use("/", connectionRequestRouter);
app.use("/", profileRouter);
app.use("/", userRouter);

app.use("/", (err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

dbConnect()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running");
    });
  })
  .catch((err) => {
    console.log(err.message);
  });

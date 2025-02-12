const express = require("express");

const connectionRequestRouter = express.Router();

const { userAuth } = require("../middlewares/userAuth");

connectionRequestRouter.post(
  "/sendConnectionRequest",
  userAuth,
  async (req, res) => {
    const user = req.user;

    res.send(user.firstName + " is sending a  connection.....");
  }
);

module.exports = connectionRequestRouter;

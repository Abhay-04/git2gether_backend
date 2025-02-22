const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { set } = require("mongoose");

const userRouter = express.Router();

const SAFE_USER_DATA = "firstName lastName gender age skills about photoURL";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", SAFE_USER_DATA);

    res.json({ data: connectionRequest });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", SAFE_USER_DATA)
      .populate("toUserId", SAFE_USER_DATA);

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }

      return row.fromUserId;
    });

    res.send({ data: data });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // send all the users except
    // 0. own card
    // 1. card of connection (sent + received)

    // find the connectionrequest where loggedinuser is toUser or fromUser

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    }).select("toUserId fromUserId");

    // find unique user from connection request

    const hideUsersFromFeed = new Set();
    connectionRequest.forEach((user) => {
      hideUsersFromFeed.add(user.toUserId.toString());
      hideUsersFromFeed.add(user.fromUserId.toString());
    });

    const user = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(SAFE_USER_DATA);

    res.json({ data: user });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

module.exports = userRouter;

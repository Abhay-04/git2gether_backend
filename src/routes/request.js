const express = require("express");

const connectionRequestRouter = express.Router();

const { userAuth } = require("../middlewares/userAuth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

connectionRequestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: `Invalid status type - ${status}`,
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

  

     

    

      // check if connection request already exists  

      const isConnectionRequestExists = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (isConnectionRequestExists) {
        throw new Error(`Connection request already exists`);
      }

      const data = await connectionRequest.save();
     

      res.json({
        message: `${ status == "interested" ?  "Connection send" : "Ignored" } `,
        data,
      });
    } catch (error) {
      res.status(400).send(error.message);
    }

    // res.send(user.firstName + " is sending a  connection.....");
  }
);

module.exports = connectionRequestRouter;

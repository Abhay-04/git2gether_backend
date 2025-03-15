const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/userAuth");
const { profileEditDataValidation } = require("../utils/validations");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.json({user : user});
  } catch (error) {
    res.status(500).send(error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  // validate the data
  try {
    if (!profileEditDataValidation(req)) {
      throw new Error("Edit is not allowed");
      
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName} ,your data is update successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = profileRouter;

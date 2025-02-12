const express = require("express");

const authRouter = express.Router();

const { signUpDataValidation } = require("../utils/validations");

const bcrypt = require("bcrypt");

const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    // Validation of data

    signUpDataValidation(req);

    //Encrypt the password

    const hashPassword = await bcrypt.hash(password, 10);

    // create a user Instance
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });

    await user.save();

    res.send("User created successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // find email in user model

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    const jwtToken = await user.getJWT();

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    } else {
      res.cookie("token", jwtToken, {
        expires: new Date(Date.now() + 168 * 3600000), // cookie will be removed after 8 hours
      });
      res.send("Login Succesful.....");
    }

    // compare db pass with password
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = authRouter;

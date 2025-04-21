const jwt = require("jsonwebtoken");

const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // get token from req

    const { token } = req.cookies;

    

    if (!token) {
      return res.status(401).send("Please login...");
    }

    // validate the token

    const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);

    const { _id } = decodedObj;

    // find the user in db and attach it to the req

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = { userAuth };

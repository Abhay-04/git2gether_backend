const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  gender: String,
});

module.exports = model("User", userSchema);

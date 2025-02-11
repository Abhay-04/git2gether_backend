const { Schema, model } = require("mongoose");
const validator = require("validator");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong ");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 150,
    },
    gender: {
      type: String,

      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gemder is not valid");
        }
      },
    },

    about: {
      type: String,
      default: "This is the default about",
      minLength: 10,
      maxLength: 150,
    },

    photoURL: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small_2x/user-profile-icon-free-vector.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("URL is not valid");
        }
      },
    },

    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);

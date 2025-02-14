const validator = require("validator");

const signUpDataValidation = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong");
  }
};

const profileEditDataValidation = (req) => {
  if (req.body.skills && req.body.skills.length > 10) {
    throw new Error("You can add upto only 10 skills");
  }

  const allowedEditFields = ["age", "gender", "about", "photoURL", "skills"];

  const isEditAllowed = Object.keys(req.body).every((fields) =>
    allowedEditFields.includes(fields)
  );

  return isEditAllowed;
};

module.exports = { signUpDataValidation, profileEditDataValidation };

const express = require("express");

const { userAuth } = require("./middlewares/userAuth");

const dbConnect = require("./config/database");
const User = require("./models/user");
const { signUpDataValidation } = require("./utils/validations");


const cookiesParser = require("cookie-parser");


const app = express();

app.use(express.json());
app.use(cookiesParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // find email in user model

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password)

    const jwtToken = await user.getJWT()

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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    console.log(user);

    res.send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;

  res.send(user.firstName + " is sending a  connection.....");
});

app.use("/", (err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

dbConnect()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running");
    });
  })
  .catch((err) => {
    console.log(err.message);
  });

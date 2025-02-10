const express = require("express");

const { auth } = require("./middlewares/auth");

const dbConnect = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/user", async (req, res) => {
  console.log(req.body);
  try {
    const user = new User(req.body);

    await user.save();

    res.send("User created successfully");
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
   
    if (!user) return res.status(404).send("User not found");


    res.send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

 
app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});

    res.send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.delete("/user", async (req, res) => {
  try {
    const user = await User.deleteOne({ email: req.body.email });

    if (user.deletedCount === 0) {
      res.send("User not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.patch("/user" , async(req, res) => {

  const data = req.body
  const email = req.body.email

  try {
  
     const user = await User.findOneAndReplace({email} , data , { returnDocument: "after" } )


    res.send(user);


    
  } catch (error) {
    res.status(500).send(error.message);
  }
})

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

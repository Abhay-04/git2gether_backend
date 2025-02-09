const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://abhaysharma0480:wQL6z9x9ROllbijx@cluster0.7mks0.mongodb.net/get2gether"
    );

    console.log("db connection established");
  } catch (error) {
    console.log(error.message);
  }
};



module.exports = dbConnect;

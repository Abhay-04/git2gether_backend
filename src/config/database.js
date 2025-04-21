const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);

    console.log("db connection established");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = dbConnect;

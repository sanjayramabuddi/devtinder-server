const mongoose = require("mongoose");

const databaseConnection = async () => {
  await mongoose.connect(
    "mongodb+srv://sanjay:3ySAh3sLWJkQhf1u@cluster0.drhv2ux.mongodb.net/devtinder",
  );
};

module.exports = databaseConnection;
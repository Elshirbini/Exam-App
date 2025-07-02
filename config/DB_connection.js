const mongoose = require("mongoose");
const superAdmin = require("./superAdmin");
const isTest = process.env.NODE_ENV === "test";

const dbConnection = async () => {
  try {
    await mongoose.connect(
      isTest ? process.env.DB_URL_TEST : process.env.DB_URL,
      {
        serverSelectionTimeoutMS: 50000,
      }
    );
    console.log("Connected to MongoDB");
    if (!isTest) {
      await superAdmin();
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

module.exports = dbConnection;

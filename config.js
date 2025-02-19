const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://pankajsharma:J8nnF6hHKzOXJXNM@creato-development-clus.tffvy.mongodb.net/new_testing_data?retryWrites=true&w=majority&appName=Creato-development-Cluster');
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected from DB");
});

mongoose.connection.on("reconnected", () => {
    console.log("Mongoose reconnected to DB");
});

export default connectDB;
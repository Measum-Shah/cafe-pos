import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./src/models/User.js";

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");

    // Delete existing admin if any
    await User.deleteMany({ email: "admin@example.com" });

    // Hash password correctly
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt);

    // Create admin user
    const admin = await User.create({
      name: "Super Admin",
      email: "admin@example.com",
      password: hashedPassword, // hashed password
      role: "admin",
    });

    console.log("Admin user created successfully:");
    console.log(admin);
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

createAdmin();

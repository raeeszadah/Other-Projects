import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";

dotenv.config();

const createAdmin = async () => {
  if (!process.env.MONGO_URI) {
    console.error(" MONGO_URI missing in .env");
    return process.exit();
  }

  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const email = process.env.VITE_ADMIN_EMAIL || "admincareer@gmail.com";
  const password = process.env.VITE_ADMIN_PASSWORD || "admin12345";

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    console.log("Admin already exists ✅");
    return process.exit();
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await Admin.create({ email, password: hashedPassword });
  console.log("✅ Admin created successfully");
  process.exit();
};

createAdmin();

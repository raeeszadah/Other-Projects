import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import validator from 'validator';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("Registration request:", { name, email });

    
    if (!validator.isEmail(email)) return res.status(400).json({ message: "Enter valid email" });
    if (password.length < 8) return res.status(400).json({ message: "Enter strong password!" });

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: "User created", user, token });
  } catch (e) {
    console.error("Registration Error:", e);
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login request:", { email });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", user, token });
  } catch (e) {
    console.error("Login Error:", e);
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successful" });
  } catch (e) {
    console.error("Logout Error:", e);
    return res.status(500).json({ message: `Logout error: ${e.message}` });
  }
};

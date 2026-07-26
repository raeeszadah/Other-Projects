import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) return res.status(401).json({ message: "Admin not found" });

    req.admin = admin;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default adminAuth;

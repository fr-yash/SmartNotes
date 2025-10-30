import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Verify admin role
export const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔍 Admin Middleware - Decoded token:", decoded);

    const user = await User.findById(decoded.id);
    console.log("🔍 Admin Middleware - User found:", user ? `${user.name} (${user.email})` : "NOT FOUND");
    console.log("🔍 Admin Middleware - User role:", user?.role);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Admin Middleware Error:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

// Verify user is active
export const checkUserActive = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(403).json({ message: "User account is suspended or inactive" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};


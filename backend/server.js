import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import authRoutes from "./src/routes/authRoutes.js";
import noteRoutes from "./src/routes/noteRoutes.js";
import aiRoutes from "./src/routes/aiRoutes.js";
import pdfRoutes from "./src/routes/pdfRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";

dotenv.config();
dotenv.config({ quiet: true });

const app = express();

// CORS configuration for both development and production
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(express.json());
app.use(cors(corsOptions));

// sample route
app.get("/", (req, res) => {
  res.send("Smart Notes API running...");
});

// Debug route to verify token
app.get("/api/debug/token", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ decoded, message: "Token is valid" });
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/admin", adminRoutes);

// DB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB connected ✅");
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
})
.catch(err => console.error(err));

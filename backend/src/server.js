import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";

dotenv.config();
dotenv.config({ quiet: true });

const app = express();



app.use(express.json());
app.use(cors());

// sample route
app.get("/", (req, res) => {
  res.send("Smart Notes API running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/pdf", pdfRoutes);

// DB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB connected ✅");
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
})
.catch(err => console.error(err));

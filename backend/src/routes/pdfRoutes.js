import express from "express";
import { uploadPDF } from "../controllers/pdfController.js";
import { authMiddleware } from "../processors/authProcessor.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", authMiddleware, upload.single("pdf"), uploadPDF);

export default router;

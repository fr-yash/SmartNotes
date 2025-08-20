import express from "express";
import { authMiddleware } from "../processors/authProcessor.js";
import { summarizeNote, extractKeywords, rewriteNote, askAboutNote, generateQuiz } from "../controllers/aiController.js";

const router = express.Router();

// All AI routes are protected
router.post("/summarize", authMiddleware, summarizeNote);
router.post("/keywords", authMiddleware, extractKeywords);
router.post("/rewrite", authMiddleware, rewriteNote);
router.post("/ask", authMiddleware, askAboutNote);
router.post("/quiz", authMiddleware, generateQuiz);

export default router;

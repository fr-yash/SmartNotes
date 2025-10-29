import express from "express";
import { authMiddleware } from "../processors/authProcessor.js";
import { summarizeNote, getNoteSummary, extractKeywords, rewriteNote, askAboutNote, generateQuiz } from "../controllers/aiController.js";

const router = express.Router();

// All AI routes are protected
router.post("/summarize", authMiddleware, summarizeNote);
router.get("/note-summary/:noteId", authMiddleware, getNoteSummary);
router.post("/keywords", authMiddleware, extractKeywords);
router.post("/rewrite", authMiddleware, rewriteNote);
router.post("/ask", authMiddleware, askAboutNote);
router.post("/quiz", authMiddleware, generateQuiz);

export default router;

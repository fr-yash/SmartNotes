import express from "express";
import { authMiddleware } from "../processors/authProcessor.js";
import { checkUserActive } from "../middleware/adminMiddleware.js";
import { summarizeNote, getNoteSummary, extractKeywords, rewriteNote, askAboutNote, generateQuiz } from "../controllers/aiController.js";

const router = express.Router();

// All AI routes are protected and require active user status
router.post("/summarize", authMiddleware, checkUserActive, summarizeNote);
router.get("/note-summary/:noteId", authMiddleware, checkUserActive, getNoteSummary);
router.post("/keywords", authMiddleware, checkUserActive, extractKeywords);
router.post("/rewrite", authMiddleware, checkUserActive, rewriteNote);
router.post("/ask", authMiddleware, checkUserActive, askAboutNote);
router.post("/quiz", authMiddleware, checkUserActive, generateQuiz);

export default router;

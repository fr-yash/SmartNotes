import express from "express";
import { createNote, getNotes, updateNote, deleteNote, shareNote } from "../controllers/noteController.js";
import { authMiddleware } from "../processors/authProcessor.js";
import { checkUserActive } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Protected routes - require active user status
router.post("/", authMiddleware, checkUserActive, createNote);
router.get("/", authMiddleware, checkUserActive, getNotes);
router.put("/:id", authMiddleware, checkUserActive, updateNote);
router.delete("/:id", authMiddleware, checkUserActive, deleteNote);
router.post("/:id/share", authMiddleware, checkUserActive, shareNote);

export default router;

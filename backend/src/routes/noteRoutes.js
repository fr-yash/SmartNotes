import express from "express";
import { createNote, getNotes, updateNote, deleteNote, shareNote } from "../controllers/noteController.js";
import { authMiddleware } from "../processors/authProcessor.js";

const router = express.Router();

// Protected routes
router.post("/", authMiddleware, createNote);
router.get("/", authMiddleware, getNotes);
router.put("/:id", authMiddleware, updateNote);
router.delete("/:id", authMiddleware, deleteNote);
router.post("/:id/share", authMiddleware, shareNote);

export default router;

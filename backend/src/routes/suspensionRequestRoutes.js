import express from "express";
import { authMiddleware } from "../processors/authProcessor.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import {
  submitSuspensionRequest,
  getUserSuspensionRequests,
  getAllSuspensionRequests,
  approveSuspensionRequest,
  rejectSuspensionRequest
} from "../controllers/suspensionRequestController.js";

const router = express.Router();

// User routes (for suspended users to submit/view requests)
router.post("/submit", authMiddleware, submitSuspensionRequest);
router.get("/my-requests", authMiddleware, getUserSuspensionRequests);

// Admin routes (to manage requests)
router.get("/", adminMiddleware, getAllSuspensionRequests);
router.patch("/:requestId/approve", adminMiddleware, approveSuspensionRequest);
router.patch("/:requestId/reject", adminMiddleware, rejectSuspensionRequest);

export default router;


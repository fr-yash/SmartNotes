import express from "express";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import {
  getAllUsers,
  getUserById,
  toggleUserStatus,
  deleteUser,
  updateAILimit,
  getAnalytics,
  getFeaturedTemplates,
  promoteToAdmin,
  demoteToUser
} from "../controllers/adminController.js";

const router = express.Router();

// All admin routes require admin middleware
router.use(adminMiddleware);

// User management
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserById);
router.patch("/users/:userId/toggle-status", toggleUserStatus);
router.delete("/users/:userId", deleteUser);
router.patch("/users/:userId/ai-limit", updateAILimit);
router.patch("/users/:userId/promote", promoteToAdmin);
router.patch("/users/:userId/demote", demoteToUser);

// Analytics
router.get("/analytics", getAnalytics);

// Featured templates
router.get("/templates", getFeaturedTemplates);

export default router;


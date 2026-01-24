import express from "express";
import { registerUser, login, getUsers } from "../controllers/user.controller.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public route
router.post("/login", login);

// Admin-only routes
router.post("/register", authMiddleware, adminMiddleware, registerUser);
router.get("/", authMiddleware, adminMiddleware, getUsers);

export default router;

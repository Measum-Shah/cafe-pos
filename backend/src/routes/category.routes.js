import express from "express";
import * as categoryController from "../controllers/category.controller.js";
import { authMiddleware} from "../middlewares/auth.middleware.js"; // assume adminMiddleware exists

const router = express.Router();

// Admin-only routes
router.post("/", authMiddleware, categoryController.createCategory);
router.delete("/:id", authMiddleware, categoryController.deleteCategory);

// Any logged-in user can view categories
router.get("/", authMiddleware, categoryController.getAllCategories);

export default router;

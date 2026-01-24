import express from "express";
import * as categoryController from "../controllers/category.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js"; // protect routes

const router = express.Router();

// Only admin can create categories
router.post("/", authMiddleware, categoryController.createCategory);
// Only admin can delete category
router.delete("/:id", authMiddleware, categoryController.deleteCategory);

// Any logged-in user can view categories
router.get("/", authMiddleware, categoryController.getAllCategories);

export default router;

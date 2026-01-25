import express from "express";
import * as saleController from "../controllers/sale.controller.js";
import { adminMiddleware, authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create sale (any logged-in user)
router.post("/", authMiddleware, saleController.createSale);

// Get all sales
router.get("/", authMiddleware,adminMiddleware, saleController.getSales);

// Get single sale
router.get("/:id", authMiddleware,adminMiddleware, saleController.getSaleById);

export default router;

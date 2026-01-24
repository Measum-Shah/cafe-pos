import express from "express";
import * as saleController from "../controllers/sale.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";

const router = express.Router();

// Any logged-in user can create a sale
router.post("/", authMiddleware, saleController.createSale);

// Admin can view all sales
router.get("/", authMiddleware, saleController.getSales);

// Get single sale
router.get("/:id", authMiddleware, saleController.getSaleById);

export default router;

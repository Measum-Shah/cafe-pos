import express from "express";
import * as reportController from "../controllers/report.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin only
router.get("/", authMiddleware, reportController.getSalesReport);
router.get("/pdf", authMiddleware, reportController.getSalesReportPDF);

export default router;

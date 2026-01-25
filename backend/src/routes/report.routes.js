import express from "express";
import * as reportController from "../controllers/report.controller.js";
import {authMiddleware,adminMiddleware} from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin only
router.get("/", authMiddleware,adminMiddleware, reportController.getSalesReport);
router.get("/pdf", authMiddleware,adminMiddleware, reportController.getSalesReportPDF);

export default router;

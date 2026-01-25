import express from "express";
import * as productController from "../controllers/product.controller.js";
import { authMiddleware} from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/", authMiddleware, productController.createProduct);
router.put("/:id", authMiddleware, productController.updateProduct);
router.delete("/:id", authMiddleware, productController.deleteProduct);

router.get("/", authMiddleware, productController.getAllProducts);
router.get("/:id", authMiddleware, productController.getProductById);

export default router;

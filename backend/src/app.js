import express from "express";
import cors from "cors";
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import saleRoutes from "./routes/sale.routes.js";
import userRoutes from "./routes/user.routes.js"; // import user routes
import reportRoutes from "./routes/report.routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use("/api/users", userRoutes); // All user-related routes prefixed with /api/users
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/reports", reportRoutes);


// Test Route
app.get("/", (req, res) => {
  res.json({ message: "Cafe POS Backend is running!" });
});

export default app;

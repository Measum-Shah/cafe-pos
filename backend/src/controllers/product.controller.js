import * as productService from "../services/product.service.js";

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, category, subCategory, price, image, stock } = req.body;
    const product = await productService.createProduct({ name, category, subCategory, price, image, stock });
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json({ products });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    res.status(200).json({ product });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const product = await productService.updateProduct(id, updateData);
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await productService.deleteProduct(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

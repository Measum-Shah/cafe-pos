import * as productService from "../services/product.service.js";

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, category, subCategory = "", price, image = "", stock = 0 } = req.body;
    // This will now return a product with the category object inside
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
    // This now returns an array where each product has a category object
    res.status(200).json({ products });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Rest of the methods stay the same as they use the updated service...
export const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json({ product });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
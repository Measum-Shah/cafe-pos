import Product from "../models/Product.js";

// Create a new product
export const createProduct = async ({ name, category, subCategory = "", price, image = "", stock = 0 }) => {
  const existing = await Product.findOne({ name, category, subCategory });
  if (existing) throw new Error("Product already exists in this category/subcategory");

  const product = await Product.create({ name, category, subCategory, price, image, stock });
  
  // Return the populated product so the frontend gets the name immediately after creation
  return await Product.findById(product._id).populate("category");
};

// Get all products - ADDED POPULATE HERE
export const getAllProducts = async () => {
  return await Product.find()
    .populate("category") // This replaces the ID with the Category object
    .sort({ name: 1 });
};

// Get product by ID - ADDED POPULATE HERE
export const getProductById = async (id) => {
  const product = await Product.findById(id).populate("category");
  if (!product) throw new Error("Product not found");
  return product;
};

// Update product by ID - ADDED POPULATE HERE
export const updateProduct = async (id, updateData) => {
  const product = await Product.findByIdAndUpdate(id, updateData, { new: true }).populate("category");
  if (!product) throw new Error("Product not found");
  return product;
};

// Delete product by ID
export const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new Error("Product not found");
  return { message: "Product deleted successfully" };
};
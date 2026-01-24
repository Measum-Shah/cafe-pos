import Product from "../models/Product.js";

// Create a new product
export const createProduct = async ({ name, category, subCategory = null, price, image = "", stock = 0 }) => {
  // Optional: check if product with same name under same category exists
  const existing = await Product.findOne({ name, category, subCategory });
  if (existing) throw new Error("Product already exists in this category/subcategory");

  const product = await Product.create({ name, category, subCategory, price, image, stock });
  return product;
};

// Get all products
export const getAllProducts = async () => {
  return await Product.find()
    .populate("category", "name")
    .populate("subCategory", "name");
};

// Get product by ID
export const getProductById = async (id) => {
  const product = await Product.findById(id)
    .populate("category", "name")
    .populate("subCategory", "name");
  if (!product) throw new Error("Product not found");
  return product;
};

// Update product by ID
export const updateProduct = async (id, updateData) => {
  const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
  if (!product) throw new Error("Product not found");
  return product;
};

// Delete product by ID
export const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new Error("Product not found");
  return { message: "Product deleted successfully" };
};

import Category from "../models/Category.js";

// Create a new category
export const createCategory = async ({ name }) => {
  const existing = await Category.findOne({ name });
  if (existing) throw new Error("Category already exists");

  const category = await Category.create({ name });
  return category;
};

// Get all categories
export const getAllCategories = async () => {
  return await Category.find().sort({ name: 1 }); // optional: sort alphabetically
};

// Delete a category
export const deleteCategory = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) throw new Error("Category not found");

  // No subcategories check needed anymore
  await Category.findByIdAndDelete(categoryId);
  return { message: "Category deleted successfully" };
};

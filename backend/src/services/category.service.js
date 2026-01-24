import Category from "../models/Category.js";

// Create a new category or subcategory
export const createCategory = async ({ name, parentCategory = null }) => {
  const existing = await Category.findOne({ name, parentCategory });
  if (existing) throw new Error("Category already exists");

  const category = await Category.create({ name, parentCategory });
  return category;
};

// Get all categories
export const getAllCategories = async () => {
  return await Category.find().populate("parentCategory", "name");
};

export const deleteCategory = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) throw new Error("Category not found");

  const subcategories = await Category.find({ parentCategory: categoryId });
  if (subcategories.length > 0)
    throw new Error("Cannot delete category with subcategories");

  await Category.findByIdAndDelete(categoryId);
  return { message: "Category deleted successfully" };
};

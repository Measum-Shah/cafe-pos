import * as categoryService from "../services/category.service.js";

// Create a new category or subcategory
export const createCategory = async (req, res) => {
  try {
    const { name, parentCategory } = req.body;
    const category = await categoryService.createCategory({ name, parentCategory });
    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({ categories });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete category by ID
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await categoryService.deleteCategory(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


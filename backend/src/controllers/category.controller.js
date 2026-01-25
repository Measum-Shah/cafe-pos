import * as categoryService from "../services/category.service.js";

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body; // only name is needed now
    const category = await categoryService.createCategory({ name });
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

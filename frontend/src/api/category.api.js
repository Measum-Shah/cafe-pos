import api from "../utils/axios";


export const createCategory = async (data) => {
  const res = await api.post("/categories", data);
  return res.data; // { message, category }
};

export const getCategories = async () => {
  const res = await api.get("/categories");
  return res.data.categories || [];
};

export const deleteCategory = async (id) => {
  const res = await api.delete(`/categories/${id}`);
  return res.data; // { message }
};
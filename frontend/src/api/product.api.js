import api from "../utils/axios";

// Create product
// PRODUCT API
export const createProduct = async (data) => {
  const res = await api.post("/products", data);
  return res.data; // { message, product }
};

export const getProducts = async () => {
  const res = await api.get("/products");
  return res.data.products || [];
};

export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data.product;
};

export const updateProduct = async (id, data) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data; // { message, product }
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data; // { message }
};
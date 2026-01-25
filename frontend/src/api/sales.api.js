import api from "../utils/axios";

// Create sale / order
export const createSale = async (data) => {
  const res = await api.post("/sales", data);
  return res.data;
};

// Get sales (optional date filter)
export const getSales = async (params = {}) => {
  const res = await api.get("/sales", { params });
  return res.data;
};

// Get sale by id
export const getSaleById = async (id) => {
  const res = await api.get(`/sales/${id}`);
  return res.data;
};

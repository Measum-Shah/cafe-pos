import api from "../utils/axios";

// Create employee (admin)
export const createUser = async (data) => {
  const res = await api.post("/users/register", data);
  return res.data;
};

// Get all users (admin)
export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

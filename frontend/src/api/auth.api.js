import api from "../utils/axios";

export const login = async (credentials) => {
  const res = await api.post("/users/login", credentials);
  return res.data;
};

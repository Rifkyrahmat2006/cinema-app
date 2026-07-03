import api from "./api";

export const register = (username, email, password) =>
  api.post("/auth/register", { username, email, password });

export const login = (credential, password) =>
  api.post("/auth/login", { credential, password });

export const getProfile = () => api.get("/auth/profile");

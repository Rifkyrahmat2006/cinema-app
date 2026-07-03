import api from "./api";

// Dashboard
export const getDashboardStats = () => api.get("/admin/dashboard");

// Movies
export const getAdminMovies = () => api.get("/admin/movies");
export const createAdminMovie = (formData) =>
  api.post("/admin/movies", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateAdminMovie = (id, formData) =>
  api.put(`/admin/movies/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteAdminMovie = (id) => api.delete(`/admin/movies/${id}`);

// Showtimes
export const getAdminShowtimes = () => api.get("/admin/showtimes");
export const createAdminShowtime = (data) => api.post("/admin/showtimes", data);
export const updateAdminShowtime = (id, data) =>
  api.put(`/admin/showtimes/${id}`, data);
export const deleteAdminShowtime = (id) => api.delete(`/admin/showtimes/${id}`);

// Orders
export const getAdminOrders = () => api.get("/admin/orders");

// Users
export const getAdminUsers = () => api.get("/admin/users");
export const updateAdminUser = (id, data) =>
  api.put(`/admin/users/${id}`, data);
export const deleteAdminUser = (id) => api.delete(`/admin/users/${id}`);

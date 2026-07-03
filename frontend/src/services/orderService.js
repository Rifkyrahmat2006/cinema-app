import api from "./api";

export const getOrders = () => api.get("/orders");

export const getOccupiedSeats = (movieName, watchAt) =>
  api.get("/orders/occupied", {
    params: { movie_name: movieName, watch_at: watchAt },
  });

export const createOrder = (formData) =>
  api.post("/orders", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const cancelOrder = (id) => api.delete(`/orders/${id}`);

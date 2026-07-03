import api from "./api";

export const getMovies = () => api.get("/movies");
export const getShowtimes = (movieId) => api.get(`/showtimes/${movieId}`);

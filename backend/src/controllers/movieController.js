const movieModel = require("../models/movieModel");

// GET /api/movies
const getMovies = async (req, res, next) => {
  try {
    const movies = await movieModel.getAll();
    return res.status(200).json({
      success: true,
      data: movies,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/movies/:id
const getMovieById = async (req, res, next) => {
  try {
    const movie = await movieModel.getById(req.params.id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Film tidak ditemukan.",
      });
    }
    return res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMovies, getMovieById };

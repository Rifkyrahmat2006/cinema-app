const showtimeModel = require("../models/showtimeModel");

// GET /api/showtimes/:movieId
const getShowtimes = async (req, res, next) => {
  try {
    const showtimes = await showtimeModel.getByMovieId(req.params.movieId);
    return res.status(200).json({
      success: true,
      data: showtimes,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getShowtimes };

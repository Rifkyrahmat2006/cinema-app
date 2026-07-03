const db = require("../config/database");

const getAll = async () => {
  const [rows] = await db.query(
    `SELECT s.id, s.movie_id, s.show_time, m.movie_name
     FROM showtimes s
     LEFT JOIN movies m ON m.id = s.movie_id
     ORDER BY m.movie_name, s.show_time`,
  );
  return rows;
};

const getByMovieId = async (movieId) => {
  const [rows] = await db.query(
    "SELECT id, show_time FROM showtimes WHERE movie_id = ? ORDER BY show_time ASC",
    [movieId],
  );
  return rows;
};

const create = async (movieId, showTime) => {
  const [result] = await db.query(
    "INSERT INTO showtimes (movie_id, show_time) VALUES (?, ?)",
    [movieId, showTime],
  );
  return { id: result.insertId, movie_id: movieId, show_time: showTime };
};

const update = async (id, movieId, showTime) => {
  const [result] = await db.query(
    "UPDATE showtimes SET movie_id = ?, show_time = ? WHERE id = ?",
    [movieId, showTime, id],
  );
  return result.affectedRows > 0;
};

const remove = async (id) => {
  const [result] = await db.query("DELETE FROM showtimes WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

module.exports = { getAll, getByMovieId, create, update, remove };

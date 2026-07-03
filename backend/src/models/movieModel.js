const db = require("../config/database");

const getAll = async () => {
  const [rows] = await db.query(
    "SELECT id, movie_name, genre, poster, rating, duration, sinopsis, price, created_at, updated_at FROM movies ORDER BY id ASC",
  );
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.query(
    "SELECT id, movie_name, genre, poster, rating, duration, sinopsis, price FROM movies WHERE id = ?",
    [id],
  );
  return rows[0] || null;
};

const create = async (data) => {
  const sql =
    "INSERT INTO movies (movie_name, genre, poster, rating, duration, sinopsis, price) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const [result] = await db.query(sql, [
    data.movie_name,
    data.genre || "Action",
    data.poster || null,
    data.rating || 0,
    data.duration || null,
    data.sinopsis || null,
    data.price || 38500,
  ]);
  return { id: result.insertId, ...data };
};

const update = async (id, data) => {
  const sql =
    "UPDATE movies SET movie_name = ?, genre = ?, poster = ?, rating = ?, duration = ?, sinopsis = ?, price = ? WHERE id = ?";
  const [result] = await db.query(sql, [
    data.movie_name,
    data.genre,
    data.poster || null,
    data.rating || 0,
    data.duration || null,
    data.sinopsis || null,
    data.price || 38500,
    id,
  ]);
  return result.affectedRows > 0;
};

const remove = async (id) => {
  const [result] = await db.query("DELETE FROM movies WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

module.exports = { getAll, getById, create, update, remove };

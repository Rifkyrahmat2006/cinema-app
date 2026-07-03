const db = require("../config/database");

const Order = {
  async getAll() {
    const [rows] = await db.query(
      `SELECT o.id, o.user_id, o.movie_name, o.watch_at, o.seat, o.ticket, o.price, o.payment_proof, o.created_at, u.username
       FROM orders o
       LEFT JOIN users u ON u.id = o.user_id
       WHERE o.deleted_at IS NULL
       ORDER BY o.id DESC`,
    );
    return rows;
  },

  async findByUserId(userId) {
    const [rows] = await db.query(
      `SELECT id, user_id, movie_name, watch_at, seat, ticket, price, payment_proof, created_at
       FROM orders
       WHERE user_id = ? AND deleted_at IS NULL
       ORDER BY id DESC`,
      [userId],
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query(
      `SELECT id, user_id, movie_name, watch_at, seat, ticket, price, payment_proof, created_at
       FROM orders
       WHERE id = ? AND deleted_at IS NULL`,
      [id],
    );
    return rows[0];
  },

  async create(data) {
    const sql = `INSERT INTO orders (user_id, movie_name, watch_at, seat, ticket, price, payment_proof) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await db.query(sql, [
      data.user_id,
      data.movie_name,
      data.watch_at,
      data.seat,
      data.ticket,
      data.price,
      data.payment_proof || null,
    ]);
    return result;
  },

  async softDelete(id) {
    const [result] = await db.query(
      "UPDATE orders SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL",
      [id],
    );
    return result;
  },

  async findOccupiedSeats(movieName, watchAt) {
    const [rows] = await db.query(
      `SELECT seat FROM orders
       WHERE movie_name = ? AND watch_at = ? AND deleted_at IS NULL`,
      [movieName, watchAt],
    );
    // Each row.seat can be "A5" or "A5, A6" (comma separated)
    const allSeats = [];
    for (const r of rows) {
      for (const s of r.seat.split(", ")) {
        const trimmed = s.trim();
        if (trimmed) allSeats.push(trimmed);
      }
    }
    return allSeats;
  },

  async isSeatTaken(movieName, watchAt, seatsList) {
    // seatsList = "A5" or "A5, A6" — check each individual seat
    const seatArray = seatsList
      .split(", ")
      .map((s) => s.trim())
      .filter(Boolean);
    if (seatArray.length === 0) return false;

    // Fetch all occupied seats for this show
    const [rows] = await db.query(
      `SELECT seat FROM orders
       WHERE movie_name = ? AND watch_at = ? AND deleted_at IS NULL`,
      [movieName, watchAt],
    );

    // Build set of all individual occupied seats
    const occupied = new Set();
    for (const r of rows) {
      for (const s of r.seat.split(", ")) {
        const t = s.trim();
        if (t) occupied.add(t);
      }
    }

    // Check if ANY requested seat is already occupied
    return seatArray.some((s) => occupied.has(s));
  },
};

module.exports = Order;

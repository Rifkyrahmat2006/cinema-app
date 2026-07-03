const express = require("express");
const router = express.Router();
const { authenticate, adminAuth } = require("../middleware/auth");
const upload = require("../middleware/upload");
const db = require("../config/database");
const movieModel = require("../models/movieModel");
const showtimeModel = require("../models/showtimeModel");
const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");

// All admin routes require auth + admin role
router.use(authenticate, adminAuth);

// ─── DASHBOARD ──────────────────────────────────
router.get("/dashboard", async (req, res) => {
  try {
    const [[{ count: movieCount }]] = await db.query(
      "SELECT COUNT(*) AS count FROM movies",
    );
    const [[{ count: showtimeCount }]] = await db.query(
      "SELECT COUNT(*) AS count FROM showtimes",
    );
    const [[{ count: orderCount }]] = await db.query(
      "SELECT COUNT(*) AS count FROM orders WHERE deleted_at IS NULL",
    );
    const [[{ count: userCount }]] = await db.query(
      "SELECT COUNT(*) AS count FROM users",
    );
    const [[{ total: totalRevenue }]] = await db.query(
      "SELECT COALESCE(SUM(price),0) AS total FROM orders WHERE deleted_at IS NULL",
    );

    return res.json({
      success: true,
      data: {
        movies: movieCount,
        showtimes: showtimeCount,
        orders: orderCount,
        users: userCount,
        revenue: totalRevenue,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ─── MOVIES CRUD ─────────────────────────────────
router.get("/movies", async (req, res) => {
  try {
    const movies = await movieModel.getAll();
    return res.json({ success: true, data: movies });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/movies", upload.single("poster"), async (req, res) => {
  try {
    const data = {
      movie_name: req.body.movie_name,
      genre: req.body.genre || "Action",
      poster: req.file
        ? `/uploads/${req.file.filename}`
        : req.body.poster || null,
      rating: req.body.rating || 0,
      duration: req.body.duration || null,
      sinopsis: req.body.sinopsis || null,
      price: req.body.price || 38500,
    };
    const movie = await movieModel.create(data);
    return res.status(201).json({ success: true, data: movie });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/movies/:id", upload.single("poster"), async (req, res) => {
  try {
    const existing = await movieModel.getById(req.params.id);
    if (!existing)
      return res
        .status(404)
        .json({ success: false, message: "Film tidak ditemukan." });

    const data = {
      movie_name: req.body.movie_name || existing.movie_name,
      genre: req.body.genre || existing.genre,
      poster: req.file
        ? `/uploads/${req.file.filename}`
        : req.body.poster || existing.poster,
      rating: req.body.rating ?? existing.rating,
      duration: req.body.duration || existing.duration,
      sinopsis: req.body.sinopsis || existing.sinopsis,
      price: req.body.price ?? existing.price,
    };
    await movieModel.update(req.params.id, data);
    return res.json({ success: true, message: "Film berhasil diperbarui." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/movies/:id", async (req, res) => {
  try {
    const ok = await movieModel.remove(req.params.id);
    if (!ok)
      return res
        .status(404)
        .json({ success: false, message: "Film tidak ditemukan." });
    return res.json({ success: true, message: "Film berhasil dihapus." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ─── SHOWTIMES CRUD ──────────────────────────────
router.get("/showtimes", async (req, res) => {
  try {
    const showtimes = await showtimeModel.getAll();
    return res.json({ success: true, data: showtimes });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/showtimes", async (req, res) => {
  try {
    const { movie_id, show_time } = req.body;
    if (!movie_id || !show_time)
      return res.status(400).json({
        success: false,
        message: "movie_id dan show_time wajib diisi.",
      });
    const st = await showtimeModel.create(movie_id, show_time);
    return res.status(201).json({ success: true, data: st });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/showtimes/:id", async (req, res) => {
  try {
    const { movie_id, show_time } = req.body;
    const ok = await showtimeModel.update(req.params.id, movie_id, show_time);
    if (!ok)
      return res
        .status(404)
        .json({ success: false, message: "Jadwal tidak ditemukan." });
    return res.json({ success: true, message: "Jadwal berhasil diperbarui." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/showtimes/:id", async (req, res) => {
  try {
    const ok = await showtimeModel.remove(req.params.id);
    if (!ok)
      return res
        .status(404)
        .json({ success: false, message: "Jadwal tidak ditemukan." });
    return res.json({ success: true, message: "Jadwal berhasil dihapus." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ─── ORDERS ──────────────────────────────────────
router.get("/orders", async (req, res) => {
  try {
    const orders = await orderModel.getAll();
    // Add full URL for payment_proof
    const data = orders.map((o) => ({
      ...o,
      payment_proof_url: o.payment_proof
        ? `${req.protocol}://${req.get("host")}/uploads/${o.payment_proof}`
        : null,
    }));
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ─── USERS CRUD ──────────────────────────────────
router.get("/users", async (req, res) => {
  try {
    const users = await userModel.getAll();
    return res.json({ success: true, data: users });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const user = await userModel.getById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User tidak ditemukan." });

    if (username && username !== user.username)
      await userModel.update(req.params.id, {
        username,
        email: email || user.email,
      });
    else if (email && email !== user.email)
      await userModel.update(req.params.id, { username: user.username, email });

    if (password) await userModel.updatePassword(req.params.id, password);
    if (role && role !== user.role)
      await userModel.updateRole(req.params.id, role);

    return res.json({ success: true, message: "User berhasil diperbarui." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const ok = await userModel.remove(req.params.id);
    if (!ok)
      return res
        .status(404)
        .json({ success: false, message: "User tidak ditemukan." });
    return res.json({ success: true, message: "User berhasil dihapus." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

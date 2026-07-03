const Order = require("../models/orderModel");

const TICKET_PRICE = 35000;
const TAX_RATE = 0.1;

// GET /api/orders — history pemesanan user
const getOrders = async (req, res) => {
  try {
    const orders = await Order.findByUserId(req.user.id);
    // Tambah full URL untuk payment_proof
    const data = orders.map((o) => ({
      ...o,
      payment_proof_url: o.payment_proof
        ? `${req.protocol}://${req.get("host")}/uploads/${o.payment_proof}`
        : null,
    }));
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET /api/orders/occupied — cek kursi terisi
const getOccupiedSeats = async (req, res) => {
  try {
    const { movie_name, watch_at } = req.query;
    if (!movie_name || !watch_at) {
      return res.status(400).json({
        success: false,
        message: "Parameter movie_name dan watch_at wajib diisi.",
      });
    }
    const seats = await Order.findOccupiedSeats(movie_name, watch_at);
    return res.status(200).json({
      success: true,
      data: seats,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// POST /api/orders — buat pesanan baru
const createOrder = async (req, res) => {
  try {
    const { movie_name, watch_at, seat, ticket } = req.body;

    if (!movie_name || !movie_name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Nama film wajib diisi.",
      });
    }
    if (!watch_at) {
      return res.status(400).json({
        success: false,
        message: "Waktu menonton (watch_at) wajib diisi.",
      });
    }
    if (!seat || !seat.trim()) {
      return res.status(400).json({
        success: false,
        message: "Kursi (seat) wajib diisi.",
      });
    }
    const ticketQty = parseInt(ticket, 10);
    if (!ticketQty || ticketQty < 1) {
      return res.status(400).json({
        success: false,
        message: "Jumlah tiket (ticket) harus minimal 1.",
      });
    }

    // Hitung harga fixed: 35000 + 10% pajak, per tiket
    const pricePerTicket = TICKET_PRICE + TICKET_PRICE * TAX_RATE; // 38500
    const totalPrice = pricePerTicket * ticketQty;

    const paymentProof = req.file ? req.file.filename : null;

    // Cek apakah kursi sudah dipesan untuk jadwal yg sama
    const taken = await Order.isSeatTaken(
      movie_name.trim(),
      watch_at,
      seat.trim(),
    );
    if (taken) {
      return res.status(409).json({
        success: false,
        message: `Salah satu kursi sudah dipesan untuk jadwal ini. Silakan pilih kursi lain.`,
      });
    }

    const result = await Order.create({
      user_id: req.user.id,
      movie_name: movie_name.trim(),
      watch_at,
      seat: seat.trim(),
      ticket: ticketQty,
      price: totalPrice,
      payment_proof: paymentProof,
    });

    return res.status(201).json({
      success: true,
      message: "Pemesanan berhasil.",
      data: { order_id: result.insertId, price: totalPrice },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// DELETE /api/orders/:id — batalkan pesanan (soft delete)
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Pemesanan tidak ditemukan.",
      });
    }
    if (order.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak punya akses ke pemesanan ini.",
      });
    }
    await Order.softDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Pemesanan berhasil dibatalkan.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { getOrders, getOccupiedSeats, createOrder, cancelOrder };

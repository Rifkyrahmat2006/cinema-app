const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticate } = require("../middleware/auth");
const upload = require("../middleware/upload");

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order / Pemesanan Tiket
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Riwayat pemesanan user saat ini
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar pemesanan user
 */
router.get("/", authenticate, orderController.getOrders);

/**
 * @swagger
 * /orders/occupied:
 *   get:
 *     summary: Cek kursi terisi untuk jadwal tertentu
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: movie_name
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: watch_at
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Daftar kursi terisi
 */
router.get("/occupied", authenticate, orderController.getOccupiedSeats);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Buat pemesanan tiket baru
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - movie_name
 *               - watch_at
 *               - seat
 *               - ticket
 *             properties:
 *               movie_name:
 *                 type: string
 *               watch_at:
 *                 type: string
 *                 format: date-time
 *               seat:
 *                 type: string
 *               ticket:
 *                 type: integer
 *               payment_proof:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Pemesanan berhasil
 */
router.post(
  "/",
  authenticate,
  upload.single("payment_proof"),
  orderController.createOrder,
);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Batalkan pemesanan (soft delete)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pemesanan dibatalkan
 */
router.delete("/:id", authenticate, orderController.cancelOrder);

module.exports = router;

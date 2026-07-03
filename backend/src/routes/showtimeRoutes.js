const express = require("express");
const router = express.Router();
const showtimeController = require("../controllers/showtimeController");

/**
 * @swagger
 * tags:
 *   name: Showtimes
 *   description: Jadwal Tayang Film
 */

/**
 * @swagger
 * /showtimes/{movieId}:
 *   get:
 *     summary: Daftar jam tayang untuk film tertentu
 *     tags: [Showtimes]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Daftar jam tayang
 */
router.get("/:movieId", showtimeController.getShowtimes);

module.exports = router;

const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Daftar Film
 */

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Daftar semua film
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/", movieController.getMovies);

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Detail film by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Film not found
 */
router.get("/:id", movieController.getMovieById);

module.exports = router;

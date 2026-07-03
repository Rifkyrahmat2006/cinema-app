const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Authentication API
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register User Baru
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username:  { type: string, example: ahmad }
 *               email:     { type: string, example: ahmad@gmail.com }
 *               password:  { type: string, example: rahasia123 }
 *     responses:
 *       201: { description: Registrasi berhasil }
 *       400: { description: Validasi gagal }
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login User (dengan username atau email)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               username:   { type: string, example: ahmad }
 *               email:      { type: string, example: ahmad@gmail.com }
 *               credential: { type: string, example: ahmad }
 *               password:    { type: string, example: rahasia123 }
 *     responses:
 *       200: { description: Login berhasil }
 *       401: { description: Username/email atau password salah }
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Profil user saat ini (token required)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Data profil user }
 *       401: { description: Token tidak valid }
 */
router.get("/profile", authenticate, authController.profile);

module.exports = router;

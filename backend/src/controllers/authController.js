const jwt = require("jsonwebtoken");
const Auth = require("../models/authModel");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email, dan password wajib diisi.",
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Format email tidak valid.",
      });
    }
    const user = await Auth.register(username, email, password);
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" },
    );
    return res.status(201).json({
      success: true,
      message: "Registrasi berhasil.",
      data: { ...user, token },
    });
  } catch (err) {
    if (err.message.includes("sudah terdaftar")) {
      return res.status(409).json({ success: false, message: err.message });
    }
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, email, credential, password } = req.body;
    const cred = credential || username || email;
    if (!cred || !password) {
      return res.status(400).json({
        success: false,
        message: "Username/email dan password wajib diisi.",
      });
    }
    const user = await Auth.login(cred, password);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Username/email atau password salah.",
      });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" },
    );
    return res.status(200).json({
      success: true,
      message: "Login berhasil.",
      data: { ...user, token },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const profile = async (req, res) => {
  try {
    const user = await Auth.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan.",
      });
    }
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  register,
  login,
  profile,
};

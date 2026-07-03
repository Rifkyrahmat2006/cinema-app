const db = require("../config/database");
const bcrypt = require("bcrypt");

const User = {
  async getAll() {
    const [rows] = await db.query(
      "SELECT id, username, email, role, created_at, updated_at FROM users ORDER BY id ASC",
    );
    return rows;
  },

  async getById(id) {
    const [rows] = await db.query(
      "SELECT id, username, email, role, created_at, updated_at FROM users WHERE id = ?",
      [id],
    );
    return rows[0] || null;
  },

  async update(id, data) {
    const sql = "UPDATE users SET username = ?, email = ? WHERE id = ?";
    const [result] = await db.query(sql, [data.username, data.email, id]);
    return result.affectedRows > 0;
  },

  async updateRole(id, role) {
    const [result] = await db.query("UPDATE users SET role = ? WHERE id = ?", [
      role,
      id,
    ]);
    return result.affectedRows > 0;
  },

  async updatePassword(id, password) {
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashed, id],
    );
    return result.affectedRows > 0;
  },

  async remove(id) {
    // Soft delete: hapus orders, lalu user
    await db.query("UPDATE orders SET deleted_at = NOW() WHERE user_id = ?", [
      id,
    ]);
    // For users, we hard delete since they have no deleted_at
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};

module.exports = User;

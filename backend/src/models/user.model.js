import { pool } from "../config/db.js";

export const UserModel = {
  async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email=:email LIMIT 1", { email });
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.query("SELECT * FROM users WHERE id=:id LIMIT 1", { id });
    return rows[0] || null;
  },

  async create({ email, password_hash, role = "ALUMNI" }) {
    const [r] = await pool.query(
      "INSERT INTO users(email,password_hash,role) VALUES(:email,:password_hash,:role)",
      { email, password_hash, role }
    );
    return r.insertId;
  },

  async markVerified(id) {
    await pool.query("UPDATE users SET is_verified=1 WHERE id=:id", { id });
  },

  async updatePassword(id, password_hash) {
    await pool.query("UPDATE users SET password_hash=:password_hash WHERE id=:id", { id, password_hash });
  },
};
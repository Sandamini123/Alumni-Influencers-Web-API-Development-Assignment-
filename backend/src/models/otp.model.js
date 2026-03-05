import { pool } from "../config/db.js";

export const OtpModel = {

  // Invalidate previous OTPs
  async invalidatePrevious(user_id, purpose) {
    await pool.query(
      `UPDATE otps
       SET used_at = NOW()
       WHERE user_id = ?
       AND purpose = ?
       AND used_at IS NULL`,
      [user_id, purpose]
    );
  },

  // Create OTP
  async create({ user_id, purpose, otp_hash, expires_at }) {
  try {
    const [result] = await pool.query(
      `INSERT INTO otps (user_id, purpose, otp_hash, expires_at)
       VALUES (:user_id, :purpose, :otp_hash, :expires_at)`,
      { user_id, purpose, otp_hash, expires_at }
    );
    console.log("OTP inserted, id:", result.insertId); // 🔹 debug
    return result.insertId;
  } catch (err) {
    console.error("Failed to insert OTP:", err); // 🔹 log the SQL error
    throw err;
  }
},

  // Get latest active OTP
  async findLatestActive(user_id, purpose) {
  const [rows] = await pool.query(
    `SELECT *
     FROM otps
     WHERE user_id = ?
     AND purpose = ?
     AND used_at IS NULL
     AND expires_at > UTC_TIMESTAMP()
     ORDER BY id DESC
     LIMIT 1`,
    [user_id, purpose]
  );

  return rows.length ? rows[0] : null;
},

  // Mark OTP as used
  async markUsed(id) {
    await pool.query(
      `UPDATE otps
       SET used_at = NOW()
       WHERE id = ?`,
      [id]
    );
  },

  // Delete expired or used OTPs
  async deleteExpired() {
    await pool.query(
      `DELETE FROM otps
       WHERE expires_at < NOW()
       OR used_at IS NOT NULL`
    );
  }
};
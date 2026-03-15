import { pool } from "../config/db.js";

export const FeaturedModel = {

  async setWinner(featured_date, user_id, bid_amount) {

    await pool.query(
      `INSERT INTO featured_alumni
       (featured_date, user_id, bid_amount)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE
       user_id = VALUES(user_id),
       bid_amount = VALUES(bid_amount)`,
      [featured_date, user_id, bid_amount]
    );

  },

  async getToday() {

    const [rows] = await pool.query(
      `SELECT
        fa.featured_date,
        fa.bid_amount,
        p.full_name,
        p.bio,
        p.linkedin_url,
        p.avatar_url
      FROM featured_alumni fa
      JOIN profiles p ON p.user_id = fa.user_id
      ORDER BY fa.featured_date DESC
      LIMIT 1`
    );

    return rows[0] || null;

  },

  async getUserInfo(user_id) {

    const [rows] = await pool.query(
      `SELECT email, full_name
       FROM profiles
       WHERE user_id = ?`,
      [user_id]
    );

    return rows[0] || null;

  }

};
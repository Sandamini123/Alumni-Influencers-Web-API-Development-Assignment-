import { pool } from "../config/db.js";

export const BidModel = {
  async getUserBidForDate(user_id, bid_date) {
    const [rows] = await pool.query(
      "SELECT * FROM bids WHERE user_id=:user_id AND bid_date=:bid_date LIMIT 1",
      { user_id, bid_date }
    );
    return rows[0] || null;
  },

  async upsertIncreaseOnly(user_id, bid_date, amount) {
    const existing = await this.getUserBidForDate(user_id, bid_date);
    if (!existing) {
      await pool.query(
        "INSERT INTO bids(user_id,bid_date,amount) VALUES(:user_id,:bid_date,:amount)",
        { user_id, bid_date, amount }
      );
      return { created: true };
    }
    if (amount <= existing.amount) {
      const err = new Error("Bid must be increased only");
      err.status = 400;
      throw err;
    }
    await pool.query(
      "UPDATE bids SET amount=:amount WHERE id=:id",
      { amount, id: existing.id }
    );
    return { created: false };
  },

  async getHighestBid(bid_date) {
    const [rows] = await pool.query(
      "SELECT * FROM bids WHERE bid_date=:bid_date ORDER BY amount DESC, updated_at ASC LIMIT 1",
      { bid_date }
    );
    return rows[0] || null;
  },

  async getTopAmount(bid_date) {
    const [rows] = await pool.query(
      "SELECT MAX(amount) AS max_amount FROM bids WHERE bid_date=:bid_date",
      { bid_date }
    );
    return rows[0]?.max_amount ?? null;
  },
};
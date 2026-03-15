import { pool } from "../config/db.js";

export const BidModel = {
  /**
   * Get a user's bid for a specific date
   */
  async getUserBidForDate(user_id, bid_date) {
    const [rows] = await pool.query(
      `SELECT * FROM bids 
       WHERE user_id = :user_id AND bid_date = :bid_date
       LIMIT 1`,
      { user_id, bid_date }
    );
    return rows[0] || null;
  },

  /**
   * Insert a new bid or update only if the new amount is higher
   */
  async upsertIncreaseOnly(user_id, bid_date, amount) {
    // Check if user already has a bid for this date
    const existing = await this.getUserBidForDate(user_id, bid_date);

    if (!existing) {
      // Insert new bid
      await pool.query(
        `INSERT INTO bids(user_id, bid_date, amount, created_at, updated_at)
         VALUES(:user_id, :bid_date, :amount, NOW(), NOW())`,
        { user_id, bid_date, amount }
      );
      return { created: true };
    }

    // If new amount is less than or equal, throw error
    if (amount <= existing.amount) {
      const err = new Error("Bid must be increased only");
      err.status = 400;
      throw err;
    }

    // Update bid
    await pool.query(
      `UPDATE bids 
       SET amount = :amount, updated_at = NOW() 
       WHERE id = :id`,
      { amount, id: existing.id }
    );

    return { created: false };
  },

  /**
   * Get the highest bid for a given date
   * Ordered by amount DESC, then oldest updated_at ASC
   */
  async getHighestBid(bid_date) {
    const [rows] = await pool.query(
      `SELECT * FROM bids
       WHERE bid_date = :bid_date
       ORDER BY amount DESC, updated_at ASC
       LIMIT 1`,
      { bid_date }
    );

    return rows[0] || null;
  },

  /**
   * Get the top bid amount for a given date
   */
  async getTopAmount(bid_date) {
    const [rows] = await pool.query(
      `SELECT MAX(amount) AS max_amount
       FROM bids
       WHERE bid_date = :bid_date`,
      { bid_date }
    );

    return rows[0]?.max_amount ?? null;
  },

  /**
   * Get all bids for a specific date (optional utility)
   */
  async getAllBidsForDate(bid_date) {
    const [rows] = await pool.query(
      `SELECT * FROM bids
       WHERE bid_date = :bid_date
       ORDER BY amount DESC, updated_at ASC`,
      { bid_date }
    );
    return rows;
  }
};
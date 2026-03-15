import { z } from "zod";
import { BidModel } from "../models/bid.model.js";
import { pool } from "../config/db.js";
import { EventAttendanceModel } from "../models/eventAttendance.model.js";

export const BiddingController = {
  placeSchema: z.object({
    body: z.object({
      amount: z.number().int().positive(),
    }),
  }),

  /**
   * Helper: Get local date in YYYY-MM-DD format
   * daysOffset = 0 for today, -1 for yesterday, etc.
   */
  getLocalDate(daysOffset = 0) {
    const now = new Date();
    now.setDate(now.getDate() + daysOffset);
    return now.toLocaleDateString("en-CA"); // YYYY-MM-DD
  },

  async placeOrUpdateBid(req, res) {
    try {
      const user_id = req.user.id;
      const amount = req.body.amount;

      // Use local date (server timezone)
      const bid_date = this.getLocalDate(0);

      await BidModel.upsertIncreaseOnly(user_id, bid_date, amount);

      // Blind feedback: WINNING / LOSING
      const maxAmount = await BidModel.getTopAmount(bid_date);
      const status = (maxAmount !== null && amount >= maxAmount) ? "WINNING" : "LOSING";

      res.json({ message: "Bid accepted", status });
    } catch (err) {
      console.error("Error placing bid:", err);
      res.status(500).json({ message: err.message || "Failed to place bid" });
    }
  },

  async remainingWinsThisMonth(req, res) {
    try {
      const user_id = req.user.id;
      const monthKey = this.getLocalDate(0).slice(0, 7); // YYYY-MM

      const [rows] = await pool.query(
        `SELECT COUNT(*) AS wins
         FROM featured_alumni
         WHERE user_id=:user_id AND DATE_FORMAT(featured_date,'%Y-%m')=:monthKey`,
        { user_id, monthKey }
      );

      const wins = rows[0].wins || 0;
      const attended = await EventAttendanceModel.hasAttended(user_id, monthKey);
      const maxWins = attended ? 4 : 3;

      res.json({
        monthKey,
        wins,
        maxWins,
        remaining: Math.max(0, maxWins - wins),
        attendedEvent: attended
      });
    } catch (err) {
      console.error("Error getting remaining wins:", err);
      res.status(500).json({ message: "Failed to get remaining wins" });
    }
  },

  async markEventAttended(req, res) {
    try {
      const user_id = req.user.id;
      const monthKey = this.getLocalDate(0).slice(0, 7); // YYYY-MM

      // Check if user already attended
      const already = await EventAttendanceModel.hasAttended(user_id, monthKey);
      if (already) {
        return res.status(400).json({ message: "You have already marked attendance for this month" });
      }

      // Mark attendance
      await EventAttendanceModel.setAttended(user_id, monthKey, true);

      res.json({ message: "Event attendance marked for this month", monthKey });
    } catch (err) {
      console.error("Error marking attendance:", err);
      res.status(500).json({ message: "Failed to mark event attendance" });
    }
  }
};
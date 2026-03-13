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

  async placeOrUpdateBid(req, res) {
    const user_id = req.user.id;
    const amount = req.body.amount;

    // Bid date = today (for today’s competition)
    const bid_date = new Date().toISOString().slice(0, 10);

    await BidModel.upsertIncreaseOnly(user_id, bid_date, amount);

    // Blind feedback: just WINNING/LOSING
    const maxAmount = await BidModel.getTopAmount(bid_date);
    const status = (maxAmount !== null && amount >= maxAmount) ? "WINNING" : "LOSING";

    res.json({ message: "Bid accepted", status });
  },

  async remainingWinsThisMonth(req, res) {
    const user_id = req.user.id;
    const monthKey = new Date().toISOString().slice(0, 7);

    // Count how many times user already featured in this month
    const [rows] = await pool.query(
      `SELECT COUNT(*) AS wins
       FROM featured_alumni
       WHERE user_id=:user_id AND DATE_FORMAT(featured_date,'%Y-%m')=:monthKey`,
      { user_id, monthKey }
    );

    const wins = rows[0].wins || 0;
    const attended = await EventAttendanceModel.hasAttended(user_id, monthKey);
    const maxWins = attended ? 4 : 3;

    res.json({ monthKey, wins, maxWins, remaining: Math.max(0, maxWins - wins), attendedEvent: attended });
  },

  async markEventAttended(req, res) {
  try {
    const user_id = req.user.id;
    const monthKey = new Date().toISOString().slice(0, 7);

    // ✅ Check if user already attended this month
    const already = await EventAttendanceModel.hasAttended(user_id, monthKey);

    if (already) {
      return res.status(400).json({
        message: "You have already marked attendance for this month",
      });
    }

    // ✅ Mark attendance
    await EventAttendanceModel.setAttended(user_id, monthKey, true);

    res.json({
      message: "Event attendance marked for this month",
      monthKey,
    });

  } catch (err) {
    console.error("Error marking attendance:", err);
    res.status(500).json({ message: "Failed to mark event attendance" });
  }
}
};
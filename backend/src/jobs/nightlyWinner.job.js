import cron from "node-cron";
import { BidModel } from "../models/bid.model.js";
import { FeaturedModel } from "../models/featured.model.js";
import { pool } from "../config/db.js";
import { EventAttendanceModel } from "../models/eventAttendance.model.js";

export function startNightlyWinnerJob() {
  // Midnight server time
  cron.schedule("* * * * *", async () => {
    try {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      const winnerBid = await BidModel.getHighestBid(yesterday);
      if (!winnerBid) return;

      // Monthly limit enforcement
      const monthKey = yesterday.slice(0, 7);
      const user_id = winnerBid.user_id;

      const [rows] = await pool.query(
        `SELECT COUNT(*) AS wins
         FROM featured_alumni
         WHERE user_id=:user_id AND DATE_FORMAT(featured_date,'%Y-%m')=:monthKey`,
        { user_id, monthKey }
      );

      const wins = rows[0].wins || 0;
      const attended = await EventAttendanceModel.hasAttended(user_id, monthKey);
      const maxWins = attended ? 4 : 3;

      if (wins >= maxWins) {
        // If over limit, pick next eligible bid
        const [eligible] = await pool.query(
          `SELECT b.*
           FROM bids b
           WHERE b.bid_date=:yesterday
           ORDER BY b.amount DESC, b.updated_at ASC`,
          { yesterday }
        );

        let picked = null;
        for (const b of eligible) {
          const [r2] = await pool.query(
            `SELECT COUNT(*) AS wins
             FROM featured_alumni
             WHERE user_id=:uid AND DATE_FORMAT(featured_date,'%Y-%m')=:monthKey`,
            { uid: b.user_id, monthKey }
          );
          const w = r2[0].wins || 0;
          const att = await EventAttendanceModel.hasAttended(b.user_id, monthKey);
          const mx = att ? 4 : 3;
          if (w < mx) { picked = b; break; }
        }
        if (!picked) return; // nobody eligible
        await FeaturedModel.setWinner(yesterday, picked.user_id, picked.amount);
        return;
      }

      await FeaturedModel.setWinner(yesterday, winnerBid.user_id, winnerBid.amount);
    } catch (e) {
      console.error("Nightly winner job failed:", e.message);
    }
  });
}
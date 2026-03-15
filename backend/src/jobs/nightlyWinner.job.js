import cron from "node-cron";
import { BidModel } from "../models/bid.model.js";
import { FeaturedModel } from "../models/featured.model.js";
import { sendWinnerEmail } from "../utils/email.js";

/**
 * Helper to get local date string in YYYY-MM-DD format
 * daysOffset = 0 for today, -1 for yesterday, etc.
 */
function getLocalDate(daysOffset = 0) {
  const now = new Date();
  now.setDate(now.getDate() + daysOffset);
  return now.toLocaleDateString("en-CA"); // YYYY-MM-DD
}

export function startNightlyWinnerJob() {
  // Runs every day at 00:00 local server time
  cron.schedule("0 0 * * *", async () => {
    console.log("Running Nightly Winner Job:", new Date());

    try {
      // Yesterday and today in local time
      const yesterday = getLocalDate(-1);
      const today = getLocalDate(0);

      console.log("Checking bids for:", yesterday);

      // Get highest bid for yesterday
      const winnerBid = await BidModel.getHighestBid(yesterday);

      if (!winnerBid) {
        console.log("No bids found for yesterday:", yesterday);
        return;
      }

      // Set winner for today
      await FeaturedModel.setWinner(
        today,
        winnerBid.user_id,
        winnerBid.amount
      );

      console.log("Winner selected:", winnerBid.user_id, "Amount:", winnerBid.amount);

      // Get user info to send email
      const user = await FeaturedModel.getUserInfo(winnerBid.user_id);

      if (user?.email) {
        await sendWinnerEmail(user.email, user.full_name);
        console.log("Winner email sent:", user.email);
      }

    } catch (error) {
      console.error("Nightly winner job failed:", error);
    }
  }, {
    scheduled: true,
    timezone: "Asia/Colombo" // Set your local timezone here
  });
}
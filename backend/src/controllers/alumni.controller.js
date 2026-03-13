import { FeaturedModel } from "../models/featured.model.js";
import { sendWinnerEmail } from "../utils/email.js";

export const AlumniController = {
  async getTodayFeatured(req, res) {
    const featured = await FeaturedModel.getToday();

    if (!featured) {
      return res.status(404).json({ message: "No featured alumnus yet" });
    }

    // Send email to the winner
    try {
      await sendWinnerEmail(featured.email, featured.name);
      console.log(`Winner email sent to ${featured.email}`);
    } catch (error) {
      console.error("Failed to send email:", error);
    }

    return res.json({ featured });
  },
};
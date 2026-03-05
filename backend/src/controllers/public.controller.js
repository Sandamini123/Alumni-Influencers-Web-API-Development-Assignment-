import { FeaturedModel } from "../models/featured.model.js";

export const PublicController = {
  async todayFeatured(req, res) {
    const featured = await FeaturedModel.getToday();
    if (!featured) return res.status(404).json({ message: "No featured alumnus yet" });
    res.json({ featured });
  },
};
import { FeaturedModel } from "../models/featured.model.js";

export const AlumniController = {

  async getTodayFeatured(req, res) {

    try {

      const featured = await FeaturedModel.getToday();

      if (!featured) {
        return res.status(404).json({
          message: "No featured alumnus yet"
        });
      }

      res.json({
        featured
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: "Server error"
      });

    }

  }

};
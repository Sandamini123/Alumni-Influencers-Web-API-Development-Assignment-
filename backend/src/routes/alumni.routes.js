import { Router } from "express";
import { requireAuth } from "../middlewares/authJwt.js";
import { AlumniController } from "../controllers/alumni.controller.js";

const router = Router();

router.get("/featured/today", requireAuth, (req, res) =>
  AlumniController.getTodayFeatured(req, res)
);

export default router;
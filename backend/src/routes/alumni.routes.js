import { Router } from "express";
import { AlumniController } from "../controllers/alumni.controller.js";

const router = Router();

// Public route, no auth required
router.get("/featured/today", AlumniController.getTodayFeatured);

export default router;
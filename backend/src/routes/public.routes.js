import { Router } from "express";
import { AlumniController } from "../controllers/alumni.controller.js";

const router = Router();

// Public Featured Alumni route
router.get("/featured/today", AlumniController.getTodayFeatured);

export default router;
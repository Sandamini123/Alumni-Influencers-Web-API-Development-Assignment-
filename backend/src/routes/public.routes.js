import { Router } from "express";
import { PublicController } from "../controllers/public.controller.js";
import { requireApiKey } from "../middlewares/apiKeyAuth.js";

const router = Router();

router.get("/featured/today", requireApiKey("PUBLIC_READ"), (req,res)=>PublicController.todayFeatured(req,res));

export default router;
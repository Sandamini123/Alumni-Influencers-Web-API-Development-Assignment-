import { Router } from "express";
import { ApiKeyController } from "../controllers/apiKey.controller.js";
import { requireAuth, requireAdmin } from "../middlewares/authJwt.js";
import { validate } from "../middlewares/validate.js";

const router = Router();

router.post("/", requireAuth, requireAdmin, validate(ApiKeyController.createSchema), (req,res)=>ApiKeyController.create(req,res));
router.get("/", requireAuth, requireAdmin, (req,res)=>ApiKeyController.list(req,res));
router.post("/:id/revoke", requireAuth, requireAdmin, (req,res)=>ApiKeyController.revoke(req,res));
router.get("/:id/stats", requireAuth, requireAdmin, (req,res)=>ApiKeyController.stats(req,res));

export default router;
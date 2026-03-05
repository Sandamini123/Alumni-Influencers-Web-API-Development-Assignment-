import { Router } from "express";
import { requireAuth } from "../middlewares/authJwt.js";
import { validate } from "../middlewares/validate.js";
import { BiddingController } from "../controllers/bidding.controller.js";

const router = Router();

router.post("/bid", requireAuth, validate(BiddingController.placeSchema), (req,res)=>BiddingController.placeOrUpdateBid(req,res));
router.get("/limits", requireAuth, (req,res)=>BiddingController.remainingWinsThisMonth(req,res));
router.post("/event-attended", requireAuth, (req,res)=>BiddingController.markEventAttended(req,res));

export default router;
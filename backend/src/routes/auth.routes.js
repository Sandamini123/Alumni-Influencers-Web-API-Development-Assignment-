import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import { authLimiter } from "../middlewares/rateLimiters.js";
import { requireAuth } from "../middlewares/authJwt.js";
import { z } from "zod";

const router = Router();

router.post("/register", authLimiter(), validate(AuthController.registerSchema), (req,res)=>AuthController.register(req,res));
router.post("/verify-email", authLimiter(), validate(AuthController.otpSchema), (req,res)=>AuthController.verifyEmail(req,res));
router.post("/login", authLimiter(), validate(AuthController.loginSchema), (req,res)=>AuthController.login(req,res));

router.post("/password/request", authLimiter(), validate(z.object({ body: z.object({ email: z.string().email() }) })), (req,res)=>AuthController.requestPasswordReset(req,res));
router.post("/password/reset", authLimiter(), validate(z.object({
  body: z.object({
    email: z.string().email(),
    otp: z.string().regex(/^\d{6}$/),
    newPassword: z.string().min(8),
  })
})), (req,res)=>AuthController.resetPassword(req,res));

router.post("/otp/resend", authLimiter(), validate(AuthController.resendSchema), (req,res)=>AuthController.resendOtp(req,res));
router.post("/logout", requireAuth, (req,res)=>AuthController.logout(req,res));

export default router;
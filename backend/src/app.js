import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { securityMiddlewares } from "./middlewares/security.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import biddingRoutes from "./routes/bidding.routes.js";
import apiKeyRoutes from "./routes/apiKey.routes.js";
import publicRoutes from "./routes/public.routes.js";
import { startNightlyWinnerJob } from "./jobs/nightlyWinner.job.js";
import { startOtpCleanupJob } from "./jobs/otpCleanup.job.js";
import { UserModel } from "./models/user.model.js";
import bcrypt from "bcrypt";
import alumniRoutes from "./routes/alumni.routes.js";

dotenv.config();

const app = express();

// ✅ Security first
securityMiddlewares(app);

// ✅ Body parsers MUST be before routes
app.use(express.json());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ Logging
app.use(morgan("dev"));

// ✅ TEMP DEBUG (remove after fixing)
// This helps confirm Postman/curl body is arriving
app.use((req, res, next) => {
  if (req.method !== "GET") {
    console.log("DEBUG BODY:", req.body);
  }
  next();
});

// ✅ serve uploads
app.use(
  `/${process.env.UPLOAD_DIR || "uploads"}`,
  express.static(path.resolve(process.env.UPLOAD_DIR || "uploads"))
);

// ✅ swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/bidding", biddingRoutes);
app.use("/api/admin/api-keys", apiKeyRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/alumni", alumniRoutes);

// ✅ error handler last
app.use(errorHandler);

// bootstrap admin user
async function bootstrapAdmin() {
  const email = process.env.ADMIN_BOOTSTRAP_EMAIL;
  const pw = process.env.ADMIN_BOOTSTRAP_PASSWORD;
  if (!email || !pw) return;

  const existing = await UserModel.findByEmail(email);
  if (!existing) {
    const password_hash = await bcrypt.hash(pw, 12);
    await UserModel.create({ email, password_hash, role: "ADMIN" });

    const admin = await UserModel.findByEmail(email);
    await UserModel.markVerified(admin.id);

    console.log("Admin bootstrapped:", email);
  }
}
bootstrapAdmin();

// jobs
startNightlyWinnerJob();
startOtpCleanupJob();

export default app;
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { securityMiddlewares } from "./middlewares/security.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import biddingRoutes from "./routes/bidding.routes.js";
import apiKeyRoutes from "./routes/apiKey.routes.js";
import publicRoutes from "./routes/public.routes.js";
import alumniRoutes from "./routes/alumni.routes.js";

dotenv.config();

const app = express();

/* ---------------- SECURITY ---------------- */
securityMiddlewares(app);

/* ---------------- BODY PARSERS ---------------- */
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

/* ---------------- LOGGING ---------------- */
app.use(morgan("dev"));

/* ---------------- DEBUG BODY (TEMP) ---------------- */
app.use((req, res, next) => {
  if (req.method !== "GET") {
    console.log("DEBUG BODY:", req.body);
  }
  next();
});

/* ---------------- STATIC FILES ---------------- */
const uploadDir = process.env.UPLOAD_DIR || "uploads";
app.use(`/${uploadDir}`, express.static(path.resolve(uploadDir)));

/* ---------------- SWAGGER ---------------- */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* ---------------- PUBLIC ROUTES ---------------- */
// No authentication required
app.use("/api/public", publicRoutes);

/* ---------------- AUTH & PROTECTED ROUTES ---------------- */
// Authentication required
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/bidding", biddingRoutes);
app.use("/api/alumni", alumniRoutes);

// Admin-only routes
app.use("/api/admin/api-keys", apiKeyRoutes);

/* ---------------- ERROR HANDLER ---------------- */
app.use(errorHandler);

export default app;
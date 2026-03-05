import rateLimit from "express-rate-limit";

export function authLimiter() {
  return rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
    max: Number(process.env.RATE_LIMIT_MAX || 80),
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests, try again later." },
  });
}
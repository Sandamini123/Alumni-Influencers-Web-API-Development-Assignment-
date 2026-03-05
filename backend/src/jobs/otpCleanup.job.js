import cron from "node-cron";
import { OtpModel } from "../models/otp.model.js";

export function startOtpCleanupJob() {
  // every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    try {
      await OtpModel.deleteExpired();
    } catch (e) {
      console.error("OTP cleanup failed:", e.message);
    }
  });
}
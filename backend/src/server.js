import app from "./app.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import { startNightlyWinnerJob } from "./jobs/nightlyWinner.job.js";
import { startOtpCleanupJob } from "./jobs/otpCleanup.job.js";
import { UserModel } from "./models/user.model.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

/* ---------------- START SERVER ---------------- */
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`📚 Swagger docs: http://localhost:${PORT}/api-docs`);
});

/* ---------------- BOOTSTRAP ADMIN ---------------- */
async function bootstrapAdmin() {
  try {
    const email = process.env.ADMIN_BOOTSTRAP_EMAIL;
    const pw = process.env.ADMIN_BOOTSTRAP_PASSWORD;

    if (!email || !pw) return;

    const existing = await UserModel.findByEmail(email);

    if (!existing) {
      const password_hash = await bcrypt.hash(pw, 12);

      await UserModel.create({
        email,
        password_hash,
        role: "ADMIN"
      });

      const admin = await UserModel.findByEmail(email);

      await UserModel.markVerified(admin.id);

      console.log("✅ Admin bootstrapped:", email);
    }
  } catch (err) {
    console.error("Admin bootstrap failed:", err.message);
  }
}

bootstrapAdmin();

/* ---------------- START CRON JOBS ---------------- */
startNightlyWinnerJob();
startOtpCleanupJob();

console.log("⏰ Cron jobs initialized");
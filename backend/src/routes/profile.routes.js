import { Router } from "express";
import { ProfileController } from "../controllers/profile.controller.js";
import { requireAuth } from "../middlewares/authJwt.js";
import { validate } from "../middlewares/validate.js";
import multer from "multer";
import path from "path";

const router = Router();

router.get("/me", requireAuth, (req,res)=>ProfileController.getMe(req,res));
router.post("/me", requireAuth, validate(ProfileController.upsertSchema), (req,res)=>ProfileController.upsert(req,res));

// Avatar upload (simple)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, process.env.UPLOAD_DIR || "uploads"),
  filename: (req, file, cb) => cb(null, `avatar_${req.user.id}_${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });

router.post("/me/avatar", requireAuth, upload.single("avatar"), async (req, res) => {
  const avatarUrl = `${process.env.BASE_URL}/${process.env.UPLOAD_DIR}/${req.file.filename}`;
  // update profile avatar
  const { pool } = await import("../config/db.js");
  await pool.query(
    `UPDATE profiles SET avatar_url=:avatarUrl WHERE user_id=:user_id`,
    { avatarUrl, user_id: req.user.id }
  );
  res.json({ avatarUrl });
});

export default router;
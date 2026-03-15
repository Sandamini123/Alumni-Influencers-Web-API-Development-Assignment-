import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { UserModel } from "../models/user.model.js";
import { OtpModel } from "../models/otp.model.js";
import { sendMail } from "../config/mailer.js";
import { generateOtp6, sha256Hex } from "../utils/crypto.js";
import { isStrongPassword, isUniversityEmail, isPasswordUnique } from "../utils/password.js";

// ✅ correct schemas
const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
});

const otpSchema = z.object({
  body: z.object({
    email: z.string().email(),
    otp: z.string().regex(/^\d{6}$/),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});

const resendSchema = z.object({
  body: z.object({
    email: z.string().email(),
    purpose: z.enum(["VERIFY_EMAIL","RESET_PASSWORD"]),
  }),
});

export const AuthController = {
  registerSchema, otpSchema, loginSchema, resendSchema,

  // REGISTER
  async register(req, res) {
    const { email, password } = req.body;

    if (!isUniversityEmail(email)) {
      return res.status(400).json({ message: "University email required" });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({ message: "Weak password. Use upper, lower, number, special, min 8." });
    }

    const unique = await isPasswordUnique(password);
    if (!unique) {
      return res.status(400).json({ message: "Password already used by another user. Choose a different one." });
    }

    const existing = await UserModel.findByEmail(email);
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const password_hash = await bcrypt.hash(password, 12);
    const userId = await UserModel.create({ email, password_hash });

    await this.sendOtpInternal(email, userId, "VERIFY_EMAIL");

    res.status(201).json({ message: "Registered. OTP sent to email." });
  },

  // VERIFY EMAIL
  async verifyEmail(req, res) {
    const { email, otp } = req.body;
    const user = await UserModel.findByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    const latest = await OtpModel.findLatestActive(user.id, "VERIFY_EMAIL");
    if (!latest) return res.status(400).json({ message: "No active OTP. Please resend." });

    if (new Date(latest.expires_at) < new Date()) return res.status(400).json({ message: "OTP expired" });

    if (sha256Hex(otp) !== latest.otp_hash) return res.status(400).json({ message: "Invalid OTP" });

    await OtpModel.markUsed(latest.id);
    await UserModel.markVerified(user.id);

    res.json({ message: "Email verified successfully" });
  },

  // LOGIN
  async login(req, res) {
  const { email, password } = req.body;

  const user = await UserModel.findByEmail(email);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  if (!user.is_verified)
    return res.status(403).json({ message: "Email not verified" });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );

  // ✅ UPDATED RESPONSE
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
},

  // LOGOUT (NEW FUNCTION)
  async logout(req, res) {
    // JWT logout normally means client deletes token
    res.json({
      message: "Logout successful. Please delete the token on the client side."
    });
  },

  // PASSWORD RESET REQUEST
  async requestPasswordReset(req, res) {
    const { email } = req.body;
    const user = await UserModel.findByEmail(email);
    if (!user) return res.status(200).json({ message: "If account exists, OTP sent." });

    await this.sendOtpInternal(email, user.id, "RESET_PASSWORD");
    res.json({ message: "If account exists, OTP sent." });
  },

  // RESET PASSWORD
  async resetPassword(req, res) {
    const { email, otp, newPassword } = req.body;

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({ message: "Weak password. Use upper, lower, number, special, min 8." });
    }

    const unique = await isPasswordUnique(newPassword);
    if (!unique) {
      return res.status(400).json({ message: "Password already used by another user. Choose a different one." });
    }

    const user = await UserModel.findByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    const latest = await OtpModel.findLatestActive(user.id, "RESET_PASSWORD");
    if (!latest) return res.status(400).json({ message: "No active OTP. Please resend." });

    if (new Date(latest.expires_at) < new Date()) return res.status(400).json({ message: "OTP expired" });

    if (sha256Hex(otp) !== latest.otp_hash) return res.status(400).json({ message: "Invalid OTP" });

    await OtpModel.markUsed(latest.id);
    const password_hash = await bcrypt.hash(newPassword, 12);
    await UserModel.updatePassword(user.id, password_hash);

    res.json({ message: "Password reset successful" });
  },

  // RESEND OTP
  async resendOtp(req, res) {
    const { email, purpose } = req.body;
    const user = await UserModel.findByEmail(email);
    if (!user) return res.status(200).json({ message: "If account exists, OTP sent." });

    await this.sendOtpInternal(email, user.id, purpose);
    res.json({ message: "OTP resent." });
  },

  // INTERNAL OTP SENDER
  async sendOtpInternal(email, userId, purpose) {
    console.log("OTP will be sent to:", email);

    const otp = generateOtp6();
    const otp_hash = sha256Hex(otp);

    await OtpModel.invalidatePrevious(userId, purpose);

    const expires_at = new Date(Date.now() + 10 * 60 * 1000);

    await OtpModel.create({
      user_id: userId,
      purpose,
      otp_hash,
      expires_at
    });

    await sendMail({
      to: email,
      subject: purpose === "VERIFY_EMAIL" ? "Verify your alumni account" : "Reset your password",
      html: `
        <h3>${purpose === "VERIFY_EMAIL" ? "Email Verification" : "Password Reset"}</h3>
        <p>Your OTP is: <b style="font-size:20px">${otp}</b></p>
        <p>This OTP expires in <b>10 minutes</b>.</p>
      `
    });
  },
};
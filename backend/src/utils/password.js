import bcrypt from "bcrypt";
import { pool } from "../config/db.js";

/**
 * Check if a password is unique among all users.
 * @param {string} password Plain text password
 * @returns {Promise<boolean>} true if unique, false if already used
 */
export async function isPasswordUnique(password) {
  const [rows] = await pool.query("SELECT password_hash FROM users");
  for (const row of rows) {
    if (!row.password_hash) continue; // skip if empty
    const match = await bcrypt.compare(password, row.password_hash);
    if (match) return false; // password already used
  }
  return true; // unique
}

/**
 * Check password strength
 */
export function isStrongPassword(pw) {
  if (typeof pw !== "string") return false;
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(pw);
}

/**
 * Check university email
 */
export function isUniversityEmail(email) {
  if (typeof email !== "string") return false;

  const allowedDomains = [
    "eastminster.ac.uk",
    "gmail.com",
  ];

  const domain = email.split("@")[1].toLowerCase();

  return allowedDomains.includes(domain);
}
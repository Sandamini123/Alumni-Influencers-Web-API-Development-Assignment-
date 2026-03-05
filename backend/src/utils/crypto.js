import crypto from "crypto";

export function generateOtp6() {
  // cryptographically secure 6-digit
  return String(crypto.randomInt(100000, 1000000));
}

export function sha256Hex(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function generateApiKeyToken() {
  // 32 bytes random token
  return crypto.randomBytes(32).toString("hex");
}
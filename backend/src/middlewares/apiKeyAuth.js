import { ApiKeyModel } from "../models/apiKey.model.js";
import { UsageModel } from "../models/usage.model.js";
import { sha256Hex } from "../utils/crypto.js";

export function requireApiKey(requiredScope = "PUBLIC_READ") {
  return async (req, res, next) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Missing client bearer token" });

    const keyHash = sha256Hex(token);
    const apiKey = await ApiKeyModel.findByHash(keyHash);

    if (!apiKey || apiKey.revoked_at) return res.status(401).json({ message: "Invalid/revoked client token" });

    const scopes = (apiKey.scopes || "").split(",").map(s => s.trim());
    if (!scopes.includes(requiredScope)) {
      return res.status(403).json({ message: "Insufficient scope" });
    }

    await ApiKeyModel.touchLastUsed(apiKey.id);
    await UsageModel.log(apiKey.id, req.originalUrl, req.method, req.ip);

    req.apiKey = apiKey;
    next();
  };
}
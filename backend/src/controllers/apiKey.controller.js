import { z } from "zod";
import { ApiKeyModel } from "../models/apiKey.model.js";
import { UsageModel } from "../models/usage.model.js";
import { generateApiKeyToken, sha256Hex } from "../utils/crypto.js";

export const ApiKeyController = {
  createSchema: z.object({
    body: z.object({
      name: z.string().min(2),
      scopes: z.string().min(2), // e.g. "PUBLIC_READ"
    }),
  }),

  async create(req, res) {
    const token = generateApiKeyToken();        // shown ONCE
    const key_hash = sha256Hex(token);

    const id = await ApiKeyModel.create({
      name: req.body.name,
      key_hash,
      scopes: req.body.scopes,
    });

    res.status(201).json({
      id,
      name: req.body.name,
      scopes: req.body.scopes,
      bearerToken: token, // show once, store securely
    });
  },

  async list(req, res) {
    const keys = await ApiKeyModel.list();
    res.json({ keys });
  },

  async revoke(req, res) {
    await ApiKeyModel.revoke(req.params.id);
    res.json({ message: "Revoked" });
  },

  async stats(req, res) {
    const rows = await UsageModel.stats(req.params.id);
    res.json({ stats: rows });
  },
};
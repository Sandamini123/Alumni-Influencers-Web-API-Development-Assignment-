import { pool } from "../config/db.js";

export const ApiKeyModel = {
  async create({ name, key_hash, scopes }) {
    const [r] = await pool.query(
      "INSERT INTO api_keys(name,key_hash,scopes) VALUES(:name,:key_hash,:scopes)",
      { name, key_hash, scopes }
    );
    return r.insertId;
  },

  async findByHash(key_hash) {
    const [rows] = await pool.query("SELECT * FROM api_keys WHERE key_hash=:key_hash LIMIT 1", { key_hash });
    return rows[0] || null;
  },

  async list() {
    const [rows] = await pool.query("SELECT id,name,scopes,revoked_at,created_at,last_used_at FROM api_keys ORDER BY id DESC");
    return rows;
  },

  async revoke(id) {
    await pool.query("UPDATE api_keys SET revoked_at=NOW() WHERE id=:id", { id });
  },

  async touchLastUsed(id) {
    await pool.query("UPDATE api_keys SET last_used_at=NOW() WHERE id=:id", { id });
  },
};
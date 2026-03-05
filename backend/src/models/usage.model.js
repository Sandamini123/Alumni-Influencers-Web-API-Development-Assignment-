import { pool } from "../config/db.js";

export const UsageModel = {
  async log(api_key_id, endpoint, method, ip) {
    await pool.query(
      "INSERT INTO api_usage(api_key_id,endpoint,method,ip) VALUES(:api_key_id,:endpoint,:method,:ip)",
      { api_key_id, endpoint, method, ip }
    );
  },

  async stats(api_key_id) {
    const [rows] = await pool.query(
      `SELECT endpoint, method, COUNT(*) as hits, MAX(created_at) as last_hit
       FROM api_usage
       WHERE api_key_id=:api_key_id
       GROUP BY endpoint, method
       ORDER BY hits DESC`,
      { api_key_id }
    );
    return rows;
  },
};
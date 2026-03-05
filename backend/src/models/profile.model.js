import { pool } from "../config/db.js";

export const ProfileModel = {
  async getByUserId(user_id) {
    const [rows] = await pool.query("SELECT * FROM profiles WHERE user_id=:user_id LIMIT 1", { user_id });
    return rows[0] || null;
  },

  async createOrUpdate({ user_id, full_name, bio, linkedin_url, avatar_url }) {
    const existing = await this.getByUserId(user_id);
    if (!existing) {
      const [r] = await pool.query(
        "INSERT INTO profiles(user_id,full_name,bio,linkedin_url,avatar_url) VALUES(:user_id,:full_name,:bio,:linkedin_url,:avatar_url)",
        { user_id, full_name, bio: bio || null, linkedin_url: linkedin_url || null, avatar_url: avatar_url || null }
      );
      return r.insertId;
    } else {
      await pool.query(
        "UPDATE profiles SET full_name=:full_name,bio=:bio,linkedin_url=:linkedin_url,avatar_url=:avatar_url WHERE user_id=:user_id",
        { user_id, full_name, bio: bio || null, linkedin_url: linkedin_url || null, avatar_url: avatar_url || null }
      );
      return existing.id;
    }
  },
};
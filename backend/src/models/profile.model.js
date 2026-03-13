// profile.model.js
import { pool } from "../config/db.js";

export const ProfileModel = {
  // Get profile by user_id
  async getByUserId(user_id) {
    const [rows] = await pool.query(
      "SELECT * FROM profiles WHERE user_id=:user_id LIMIT 1",
      { user_id }
    );
    return rows[0] || null;
  },

  // Create a new profile or update existing
  async createOrUpdate({ user_id, full_name, bio, linkedin_url, avatar_url }) {
    const existing = await this.getByUserId(user_id);

    if (!existing) {
      const [result] = await pool.query(
        "INSERT INTO profiles(user_id, full_name, bio, linkedin_url, avatar_url) VALUES(:user_id, :full_name, :bio, :linkedin_url, :avatar_url)",
        { user_id, full_name, bio: bio || null, linkedin_url: linkedin_url || null, avatar_url: avatar_url || null }
      );
      return result.insertId;
    } else {
      await pool.query(
        "UPDATE profiles SET full_name=:full_name, bio=:bio, linkedin_url=:linkedin_url, avatar_url=:avatar_url WHERE user_id=:user_id",
        { user_id, full_name, bio: bio || null, linkedin_url: linkedin_url || null, avatar_url: avatar_url || null }
      );
      return existing.id;
    }
  },

  // === Nested array helpers ===

  async getDegrees(profile_id) {
    const [rows] = await pool.query(
      "SELECT * FROM degrees WHERE profile_id=:profile_id",
      { profile_id }
    );
    return rows;
  },

  async getCertifications(profile_id) {
    const [rows] = await pool.query(
      "SELECT * FROM certifications WHERE profile_id=:profile_id",
      { profile_id }
    );
    return rows;
  },

  async getLicenses(profile_id) {
    const [rows] = await pool.query(
      "SELECT * FROM licenses WHERE profile_id=:profile_id",
      { profile_id }
    );
    return rows;
  },

  async getShortCourses(profile_id) {
    const [rows] = await pool.query(
      "SELECT * FROM short_courses WHERE profile_id=:profile_id",
      { profile_id }
    );
    return rows;
  },

  async getEmployments(profile_id) {
    const [rows] = await pool.query(
      "SELECT * FROM employments WHERE profile_id=:profile_id",
      { profile_id }
    );
    return rows;
  },
};
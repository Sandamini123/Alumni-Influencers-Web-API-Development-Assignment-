import { z } from "zod";
import { ProfileModel } from "../models/profile.model.js";
import { pool } from "../config/db.js";

const urlOpt = z.string().url().optional().or(z.literal(""));

export const ProfileController = {
  // Validation schema for upsert
  upsertSchema: z.object({
    body: z.object({
      full_name: z.string().min(2),
      bio: z.string().max(2000).optional(),
      linkedin_url: urlOpt,
      degrees: z.array(
        z.object({
          title: z.string().min(2),
          university_url: z.string().url(),
          completed_at: z.string(), // YYYY-MM-DD
        })
      ).optional(),
      certifications: z.array(
        z.object({
          name: z.string().min(2),
          course_url: z.string().url(),
          completed_at: z.string(),
        })
      ).optional(),
      licenses: z.array(
        z.object({
          name: z.string().min(2),
          awarding_body_url: z.string().url(),
          completed_at: z.string(),
        })
      ).optional(),
      short_courses: z.array(
        z.object({
          name: z.string().min(2),
          course_url: z.string().url(),
          completed_at: z.string(),
        })
      ).optional(),
      employments: z.array(
        z.object({
          company: z.string().min(2),
          role_title: z.string().min(2),
          start_date: z.string(),
          end_date: z.string().optional().nullable(),
        })
      ).optional(),
    }),
  }),

  // GET /me
  async getMe(req, res) {
    try {
      const profile = await ProfileModel.getByUserId(req.user.id);

      if (!profile) return res.status(404).json({ message: "Profile not found" });

      // Fetch related arrays in parallel
      const [degrees, certifications, licenses, short_courses, employments] = await Promise.all([
        ProfileModel.getDegrees(profile.id),
        ProfileModel.getCertifications(profile.id),
        ProfileModel.getLicenses(profile.id),
        ProfileModel.getShortCourses(profile.id),
        ProfileModel.getEmployments(profile.id),
      ]);

      res.json({
        profile: {
          ...profile,
          degrees,
          certifications,
          licenses,
          short_courses,
          employments,
        },
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // POST /me (create or update)
  async upsert(req, res) {
    try {
      const user_id = req.user.id;
      const body = req.body;

      const profile_id = await ProfileModel.createOrUpdate({
        user_id,
        full_name: body.full_name,
        bio: body.bio,
        linkedin_url: body.linkedin_url || null,
        avatar_url: null,
      });

      // Helper to delete all existing entries
      const tables = ["degrees", "certifications", "licenses", "short_courses", "employments"];
      for (const table of tables) {
        await pool.query(`DELETE FROM ${table} WHERE profile_id=:profile_id`, { profile_id });
      }

      // Helper to insert multiple rows
      const insertMany = async (rows, mapper) => {
        for (const r of rows || []) {
          const { sql, params } = mapper(r);
          await pool.query(sql, params);
        }
      };

      // Insert multi-entry sections
      await insertMany(body.degrees, (d) => ({
        sql: "INSERT INTO degrees(profile_id,title,university_url,completed_at) VALUES(:profile_id,:title,:university_url,:completed_at)",
        params: { profile_id, title: d.title, university_url: d.university_url, completed_at: d.completed_at },
      }));

      await insertMany(body.certifications, (c) => ({
        sql: "INSERT INTO certifications(profile_id,name,course_url,completed_at) VALUES(:profile_id,:name,:course_url,:completed_at)",
        params: { profile_id, name: c.name, course_url: c.course_url, completed_at: c.completed_at },
      }));

      await insertMany(body.licenses, (l) => ({
        sql: "INSERT INTO licenses(profile_id,name,awarding_body_url,completed_at) VALUES(:profile_id,:name,:awarding_body_url,:completed_at)",
        params: { profile_id, name: l.name, awarding_body_url: l.awarding_body_url, completed_at: l.completed_at },
      }));

      await insertMany(body.short_courses, (s) => ({
        sql: "INSERT INTO short_courses(profile_id,name,course_url,completed_at) VALUES(:profile_id,:name,:course_url,:completed_at)",
        params: { profile_id, name: s.name, course_url: s.course_url, completed_at: s.completed_at },
      }));

      await insertMany(body.employments, (e) => ({
        sql: "INSERT INTO employments(profile_id,company,role_title,start_date,end_date) VALUES(:profile_id,:company,:role_title,:start_date,:end_date)",
        params: { profile_id, company: e.company, role_title: e.role_title, start_date: e.start_date, end_date: e.end_date || null },
      }));

      res.json({ message: "Profile saved successfully" });
    } catch (error) {
      console.error("Error upserting profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
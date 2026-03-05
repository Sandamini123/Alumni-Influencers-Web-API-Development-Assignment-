import { z } from "zod";
import { ProfileModel } from "../models/profile.model.js";
import { pool } from "../config/db.js";

const urlOpt = z.string().url().optional().or(z.literal(""));

export const ProfileController = {
  upsertSchema: z.object({
    body: z.object({
      full_name: z.string().min(2),
      bio: z.string().max(2000).optional(),
      linkedin_url: urlOpt,
      degrees: z.array(z.object({
        title: z.string().min(2),
        university_url: z.string().url(),
        completed_at: z.string(), // YYYY-MM-DD
      })).optional(),
      certifications: z.array(z.object({
        name: z.string().min(2),
        course_url: z.string().url(),
        completed_at: z.string(),
      })).optional(),
      licenses: z.array(z.object({
        name: z.string().min(2),
        awarding_body_url: z.string().url(),
        completed_at: z.string(),
      })).optional(),
      short_courses: z.array(z.object({
        name: z.string().min(2),
        course_url: z.string().url(),
        completed_at: z.string(),
      })).optional(),
      employments: z.array(z.object({
        company: z.string().min(2),
        role_title: z.string().min(2),
        start_date: z.string(),
        end_date: z.string().optional().nullable(),
      })).optional(),
    }),
  }),

  async getMe(req, res) {
    const profile = await ProfileModel.getByUserId(req.user.id);
    res.json({ profile });
  },

  async upsert(req, res) {
    const user_id = req.user.id;
    const body = req.body;

    const profile_id = await ProfileModel.createOrUpdate({
      user_id,
      full_name: body.full_name,
      bio: body.bio,
      linkedin_url: body.linkedin_url || null,
      avatar_url: null,
    });

    // Replace multi-entry sections (simple + clean)
    await pool.query("DELETE FROM degrees WHERE profile_id=:profile_id", { profile_id });
    await pool.query("DELETE FROM certifications WHERE profile_id=:profile_id", { profile_id });
    await pool.query("DELETE FROM licenses WHERE profile_id=:profile_id", { profile_id });
    await pool.query("DELETE FROM short_courses WHERE profile_id=:profile_id", { profile_id });
    await pool.query("DELETE FROM employments WHERE profile_id=:profile_id", { profile_id });

    const insertMany = async (table, rows, mapper) => {
      for (const r of rows || []) {
        const { sql, params } = mapper(r);
        await pool.query(sql, params);
      }
    };

    await insertMany("degrees", body.degrees, (d) => ({
      sql: "INSERT INTO degrees(profile_id,title,university_url,completed_at) VALUES(:profile_id,:title,:university_url,:completed_at)",
      params: { profile_id, title: d.title, university_url: d.university_url, completed_at: d.completed_at },
    }));

    await insertMany("certifications", body.certifications, (c) => ({
      sql: "INSERT INTO certifications(profile_id,name,course_url,completed_at) VALUES(:profile_id,:name,:course_url,:completed_at)",
      params: { profile_id, name: c.name, course_url: c.course_url, completed_at: c.completed_at },
    }));

    await insertMany("licenses", body.licenses, (l) => ({
      sql: "INSERT INTO licenses(profile_id,name,awarding_body_url,completed_at) VALUES(:profile_id,:name,:awarding_body_url,:completed_at)",
      params: { profile_id, name: l.name, awarding_body_url: l.awarding_body_url, completed_at: l.completed_at },
    }));

    await insertMany("short_courses", body.short_courses, (s) => ({
      sql: "INSERT INTO short_courses(profile_id,name,course_url,completed_at) VALUES(:profile_id,:name,:course_url,:completed_at)",
      params: { profile_id, name: s.name, course_url: s.course_url, completed_at: s.completed_at },
    }));

    await insertMany("employments", body.employments, (e) => ({
      sql: "INSERT INTO employments(profile_id,company,role_title,start_date,end_date) VALUES(:profile_id,:company,:role_title,:start_date,:end_date)",
      params: { profile_id, company: e.company, role_title: e.role_title, start_date: e.start_date, end_date: e.end_date || null },
    }));

    res.json({ message: "Profile saved" });
  },
};
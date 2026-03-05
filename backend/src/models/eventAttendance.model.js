import { pool } from "../config/db.js";

export const EventAttendanceModel = {
  async hasAttended(user_id, monthKey) {
    const [rows] = await pool.query(
      "SELECT * FROM event_attendance WHERE user_id=:user_id AND month_key=:monthKey LIMIT 1",
      { user_id, monthKey }
    );
    return rows[0]?.attended === 1;
  },

  async setAttended(user_id, monthKey, attended = true) {
    await pool.query(
      `INSERT INTO event_attendance(user_id,month_key,attended)
       VALUES(:user_id,:monthKey,:attended)
       ON DUPLICATE KEY UPDATE attended=VALUES(attended)`,
      { user_id, monthKey, attended: attended ? 1 : 0 }
    );
  },
};
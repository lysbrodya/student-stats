import { supabase } from "../lib/db.js";

export default async function handler(req, res) {
  try {
    const { sprint, studentId, streamId } = req.query;

    let query = supabase.from("tasks").select("*");

    if (sprint) {
      query = query.eq("sprint", sprint);
    }

    if (studentId) {
      query = query.eq("student_id", studentId);
    }

    if (streamId) {
      query = query.eq("stream_id", streamId);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.status(200).json(data);
  } catch (e) {
    console.error("TASKS ERROR:", e);
    res.status(500).json({ error: "DB error" });
  }
}

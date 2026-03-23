import { supabase } from "../lib/db.js";

export default async function handler(req, res) {
  try {
    const { streamId } = req.query;

    let query = supabase.from("students").select("*");

    // фильтр по stream
    if (streamId) {
      query = query.eq("stream_id", streamId);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Преобразуем маленькие буквы в заглавные для совместимости с фронтом
    const formatted = data.map((student) => ({
      ...student,
      A: student.a,
      B: student.b,
      C: student.c,
      D: student.d,
      E: student.e,
      F: student.f,
    }));

    res.status(200).json(formatted);
  } catch (e) {
    console.error("RESULTS ERROR:", e);
    res.status(500).json({ error: "DB error" });
  }
}

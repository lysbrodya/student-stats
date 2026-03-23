import { supabase } from "./db.js";
export default async function handler(req, res) {
  try {
    const { streamId } = req.query;
    let query = supabase.from("tasks").select("*");

    // фильтр по stream
    if (streamId) {
      query = query.eq("stream_id", streamId);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.status(200).json(data);
  } catch (e) {
    console.error("RESULTS ERROR:", e);
    res.status(500).json({ error: "DB error" });
  }
}

import { supabase } from "../../lib/db.js";

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (e) {
    console.error("RESULT BY ID ERROR:", e);
    res.status(500).json({ error: "DB error" });
  }
}

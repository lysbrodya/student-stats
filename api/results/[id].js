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

    // Преобразуем маленькие буквы в заглавные для совместимости с фронтом
    const formatted = {
      ...data,
      A: data.a,
      B: data.b,
      C: data.c,
      D: data.d,
      E: data.e,
      F: data.f,
    };

    res.status(200).json(formatted);
  } catch (e) {
    console.error("RESULT BY ID ERROR:", e);
    res.status(500).json({ error: "DB error" });
  }
}

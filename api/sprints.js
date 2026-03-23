import { supabase } from "../lib/db.js";

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from("sprints")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;

    // Преобразуем обратно в формат, ожидаемый клиентом
    const formatted = data.map((s) => ({
      id: s.id,
      sprint: s.name,
      student: s.student_name,
      score: s.score,
      done: s.done,
    }));

    res.status(200).json(formatted);
  } catch (e) {
    console.error("SPRINTS ERROR:", e);
    res.status(500).json({ error: "DB error" });
  }
}

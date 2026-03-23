import { supabase } from "../lib/db.js";

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from("sprints")
      .select("*")
      .order("sprint", { ascending: true });

    if (error) throw error;

    // Преобразуем обратно в формат, ожидаемый клиентом
    const formatted = data.map((s) => ({
      id: s.id,
      sprint: s.sprint,
    }));

    res.status(200).json(formatted);
  } catch (e) {
    console.error("SPRINTS ERROR:", e);
    res.status(500).json({ error: "DB error" });
  }
}

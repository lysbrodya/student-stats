import { supabase } from "../lib/db.js";
import { getSprints } from "../lib/notion.js";

export default async function handler(req, res) {
  try {
    const sprints = await getSprints();

    const formatted = sprints.map((s) => ({
      id: s.id,
      name: s.sprint,
      student_name: s.student,
      score: s.score,
      number: 0, // на случай, если поле ещё нет, чтобы не было NULL (опционально)
    }));

    // чистим таблицу
    await supabase.from("sprints").delete().neq("id", "");

    // вставляем заново
    const { error } = await supabase.from("sprints").insert(formatted);

    if (error) throw error;

    res.json({ success: true, count: formatted.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

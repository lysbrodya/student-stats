import { supabase } from "./db.js";
import { getResults } from "./notion.js"; // твоя функция из Notion

export default async function handler(req, res) {
  try {
    // 1. берём данные из Notion
    const results = await getResults();
    console.log(results[0]);
    // 2. преобразуем (если нужно)
    const students = results.map((r) => ({
      id: r.id,
      name: r.name,
      productivity: r.productivity,
      effectiveness: r.effectiveness,
      level: r.level,
      time: r.time,
      course: r.course,
      stream_id: r.stream,
    }));

    // 3. чистим таблицу (упростим пока)
    await supabase.from("students").delete().neq("id", "");

    // 4. вставляем новые данные
    const { error } = await supabase.from("students").insert(students);

    if (error) throw error;

    res.json({ success: true, count: students.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

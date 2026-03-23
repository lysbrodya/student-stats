import { supabase } from "../lib/db.js";
import { getSprintTasks } from "../lib/notion.js";

export default async function handler(req, res) {
  try {
    const tasks = await getSprintTasks();

    // 2. преобразуем (если нужно)
    const formatted = tasks.map((t) => ({
      id: t.id,
      student_id: t.student,
      stream_id: t.stream,
      sprint: t.sprint,
      task: t.task,
      score: t.score,
      done: t.done,
    }));
    // чистим таблицу
    await supabase.from("tasks").delete().neq("id", "");

    // вставляем
    const { error } = await supabase.from("tasks").insert(formatted);
    if (error) throw error;

    res.json({ success: true, count: formatted.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

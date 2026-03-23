import { supabase } from "./db.js";
import { getSprintTasks, getResults } from "./notion.js";

export default async function handler(req, res) {
  try {
    const tasks = await getSprintTasks();
    const students = await getResults();

    // 👇 делаем мапу student → stream
    const studentMap = new Map(students.map((s) => [s.id, s.stream]));

    const formatted = tasks.map((t) => ({
      id: t.id,
      student_id: t.student,
      stream_id: studentMap.get(t.student) || null, // 👈 ВАЖНО
      sprint: String(t.sprint), // 👈 тоже важно
      task: t.task,
      score: t.score,
      done: t.done,
    }));

    await supabase.from("tasks").delete().neq("id", "");
    const { error } = await supabase.from("tasks").insert(formatted);

    if (error) throw error;

    res.json({ success: true, count: formatted.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

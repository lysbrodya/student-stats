import { supabase } from "./db.js";
import { getCourseStreams } from "./notion.js";

export default async function handler(req, res) {
  try {
    const streams = await getCourseStreams();

    const formatted = streams.map((s) => ({
      id: s.id,
      name: s.name,
      course: s.course,
      number: s.number,
      done: s.done,
    }));

    // чистим таблицу
    await supabase.from("streams").delete().neq("id", "");

    // вставляем заново
    const { error } = await supabase.from("streams").insert(formatted);

    if (error) throw error;

    res.json({ success: true, count: formatted.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

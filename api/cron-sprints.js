import { supabase } from "../lib/db.js";
import { getSprints } from "../lib/notion.js";

export default async function handler(req, res) {
  try {
    const sprints = await getSprints();
    console.log("Sprints from Notion:", sprints.length, sprints.slice(0, 2));

    const formatted = sprints.map((s) => ({
      id: s.id,
      sprint: s.sprint,
      student: s.student,
    }));

    console.log(
      "Formatted for Supabase:",
      formatted.length,
      formatted.slice(0, 2),
    );

    // чистим таблицу
    await supabase.from("sprints").delete().neq("id", "");

    // вставляем заново
    const { error } = await supabase.from("sprints").insert(formatted);

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }

    console.log("Success: inserted", formatted.length, "sprints");
    res.json({ success: true, count: formatted.length });
  } catch (err) {
    console.error("CRON-SPRINTS FULL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}

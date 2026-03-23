import { supabase } from "../lib/db.js";
import { getSprints } from "../lib/notion.js";

export default async function handler(req, res) {
  try {
    console.log("🔵 CRON-SPRINTS START");
    const sprints = await getSprints();
    console.log("📊 Sprints from Notion:", {
      count: sprints.length,
      data: sprints.slice(0, 3),
    });

    if (!sprints || sprints.length === 0) {
      console.warn("⚠️ No sprints from Notion!");
      return res.json({ success: true, count: 0, warning: "No sprints in Notion" });
    }

    const formatted = sprints.map((s) => ({
      id: s.id,
      sprint: s.sprint || "Unknown",
      student: s.student || "Unknown",
    }));

    console.log("✅ Formatted data:", {
      count: formatted.length,
      sample: formatted[0],
    });

    // чистим таблицу
    const { count: deletedCount } = await supabase
      .from("sprints")
      .delete()
      .neq("id", "");
    console.log(`🗑️ Deleted ${deletedCount} old records`);

    // вставляем заново
    const { error, data } = await supabase
      .from("sprints")
      .insert(formatted)
      .select();

    if (error) {
      console.error("❌ Supabase insert error:", error);
      throw error;
    }

    console.log("🎉 Success: inserted", data?.length || formatted.length, "sprints");
    res.json({ success: true, count: formatted.length, inserted: data?.length });
  } catch (err) {
    console.error("💥 CRON-SPRINTS FULL ERROR:", err);
    res.status(500).json({ error: err.message, code: err.code });
  }
}

import { supabase } from "./db.js";

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from("streams")
      .select("*")
      //   .eq("done", false)
      .order("number", { ascending: true });

    if (error) throw error;

    res.status(200).json(data);
  } catch (e) {
    console.error("STREAMS ERROR:", e);
    res.status(500).json({ error: "DB error" });
  }
}

export default async function handler(req, res) {
  try {
    const { sprint, studentId } = req.query;

    let query = supabase.from("tasks").select("*");

    if (sprint) {
      query = query.eq("sprint", sprint);
    }

    if (studentId) {
      query = query.eq("student_id", studentId);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.status(200).json(data);
  } catch (e) {
    console.error("TASKS ERROR:", e);
    res.status(500).json({ error: "DB error" });
  }
}

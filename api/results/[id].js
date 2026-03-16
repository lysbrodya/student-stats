import { getResults } from "../notion.js";

export default async function handler(req, res) {
  const { id } = req.query; // Vercel передаёт параметр как query

  try {
    const results = await getResults();
    const student = results.find((s) => s.id === id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json(student);
  } catch (e) {
    res.status(500).json({ error: "Notion error" });
  }
}

import { getSprints, getResults } from "./notion.js";

export default async function handler(req, res) {
  try {
    const { streamId } = req.query;

    const sprints = await getSprints();

    if (!streamId) {
      return res.status(200).json(sprints);
    }

    // 👇 получаем студентов этого потока
    const students = await getResults(streamId);
    const studentIds = students.map((s) => s.id);

    // 👇 фильтруем спринты по студентам
    const filtered = sprints.filter((s) => studentIds.includes(s.student));

    res.status(200).json(filtered);
  } catch (e) {
    console.error("SPRINTS ERROR:", e);
    res.status(500).json({ error: "Notion error" });
  }
}

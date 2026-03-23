import { getSprintTasks, getResults } from "./lib/notion.js";

export default async function handler(req, res) {
  try {
    const { streamId } = req.query;

    const tasks = await getSprintTasks();

    if (!streamId) {
      return res.status(200).json(tasks);
    }

    // 👇 получаем студентов текущего потока
    const students = await getResults(streamId);
    const studentIds = students.map((s) => s.id);

    // 👇 фильтруем задачи по студентам
    const filtered = tasks.filter((t) => studentIds.includes(t.student));

    res.status(200).json(filtered);
  } catch (e) {
    console.error("TASKS ERROR:", e);
    res.status(500).json({ error: "Notion error" });
  }
}

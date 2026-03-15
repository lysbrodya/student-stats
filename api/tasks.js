import { getSprintTasks } from "../server/notion.js";

export default async function handler(req, res) {
  try {
    const tasks = await getSprintTasks();
    res.status(200).json(tasks);
  } catch (e) {
    res.status(500).json({ error: "Notion error" });
  }
}

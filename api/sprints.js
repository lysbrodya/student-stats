import { getSprints } from "../lib/notion.js";

export default async function handler(req, res) {
  try {
    const sprints = await getSprints();
    res.status(200).json(sprints);
  } catch (e) {
    res.status(500).json({ error: "Notion error" });
  }
}

import { getResults } from "./notion.js";

export default async function handler(req, res) {
  try {
    const results = await getResults();
    res.status(200).json(results);
  } catch (e) {
    res.status(500).json({ error: "Notion error" });
  }
}

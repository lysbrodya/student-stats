import { getResults } from "./notion.js";

export default async function handler(req, res) {
  try {
    const { streamId } = req.query; // 👈 ВОТ ЭТО ДОБАВЬ

    const results = await getResults(streamId); // 👈 И СЮДА

    res.status(200).json(results);
  } catch (e) {
    console.error("RESULTS ERROR:", e);
    res.status(500).json({ error: "Notion error" });
  }
}

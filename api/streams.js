import { getCourseStreams } from "./notion.js";

export default async function handler(req, res) {
  try {
    const streams = await getCourseStreams();
    res.json(streams);
  } catch (e) {
    console.error("NOTION ERROR:", e.body || e.message);
    res.status(500).json({ error: e.body || e.message });
  }
}

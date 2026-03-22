import { getCourseStreams } from "./notion.js";

export default async function handler(req, res) {
  try {
    const streams = await getCourseStreams();

    console.log("STREAMS DATA:", streams); // 👈 ЛОГ

    res.status(200).json(streams);
  } catch (e) {
    console.error("STREAMS ERROR:", e); // 👈 ВАЖНО

    res.status(500).json({
      error: e.message,
      details: e.body || null,
    });
  }
}

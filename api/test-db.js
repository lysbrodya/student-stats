import { supabase } from "./db.js";

export default async function handler(req, res) {
  const { data, error } = await supabase.from("students").select("*");

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
}

const { createClient } = require("@supabase/supabase-js");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  try {
    const body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body || {};

    console.log("POST BODY:", body);

    const order = {
      name: body.name || "",
      email: body.email || "",
      phone: body.phone || "",
      pickup: body.pickup || "",
      amount: Number(body.amount) || 0,
      painting: body.items || []
    };

    const { data, error } = await supabase
      .from("orders")
      .insert([order])
      .select();

    console.log("SUPABASE RESULT:", { data, error });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ ok: true, data });

  } catch (e) {
    console.log("ERROR:", e);
    return res.status(500).json({ error: e.message });
  }
};

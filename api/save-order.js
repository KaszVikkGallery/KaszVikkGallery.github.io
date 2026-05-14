const { createClient } = require("@supabase/supabase-js");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // 🔥 ENV CHECK (EZ A LEGFONTOSABB)
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      return res.status(500).json({
        error: "Missing Supabase environment variables"
      });
    }

    // 🔥 SUPABASE CLIENT CSAK ITT (NEM TOP LEVEL!)
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // =========================
    // GET ORDERS (ADMIN)
    // =========================
    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return res.status(200).json(data);
    }

    // =========================
    // SAVE ORDER
    // =========================
    if (req.method === "POST") {
      const body =
        typeof req.body === "string"
          ? JSON.parse(req.body)
          : req.body || {};

      const { error } = await supabase.from("orders").insert([
        {
          name: body.name || "",
          email: body.email || "",
          phone: body.phone || "",
          pickup: body.pickup || "",
          amount: body.amount || 0,
          created_at: new Date().toISOString()
        }
      ]);

      if (error) throw error;

      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Only GET/POST allowed" });

  } catch (err) {
    console.log("ERROR:", err);

    return res.status(500).json({
      error: err.message || "Unknown error"
    });
  }
};

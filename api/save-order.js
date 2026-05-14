const { createClient } = require("@supabase/supabase-js");

module.exports = async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  try {

    // ---------------- GET ----------------
    if (req.method === "GET") {

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.log("GET ERROR:", error);
        return res.status(500).json(error);
      }

      return res.status(200).json(data);
    }

    // ---------------- POST ----------------
    if (req.method === "POST") {

      const body =
        typeof req.body === "string"
          ? JSON.parse(req.body)
          : req.body || {};

      console.log("🔥 ORDER RECEIVED:", body);

      const insertData = {
        name: body.name || "",
        email: body.email || "",
        phone: body.phone || "",
        pickup: body.pickup || "",
        amount: body.amount || 0,
        created_at: new Date().toISOString()
      };

      // items csak ha van és jó
      if (Array.isArray(body.items)) {
        insertData.items = body.items;
      }

      const { data, error } = await supabase
        .from("orders")
        .insert([insertData])
        .select();

      if (error) {
        console.log("💥 SUPABASE ERROR:", error);
        return res.status(500).json(error);
      }

      console.log("✅ SAVED:", data);

      return res.status(200).json({
        ok: true,
        data
      });
    }

    return res.status(405).json({ error: "Only GET/POST allowed" });

  } catch (err) {
    console.log("💥 CATCH ERROR:", err);

    return res.status(500).json({
      error: err.message
    });
  }
};

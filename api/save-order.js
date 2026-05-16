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

  // ---------------- GET ----------------
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("GET ERROR:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data || []);
  }

  // ---------------- POST ----------------
  if (req.method === "POST") {
    try {

      const body =
        typeof req.body === "string"
          ? JSON.parse(req.body)
          : req.body || {};

      console.log("POST BODY:", body);

      const { error } = await supabase
        .from("orders")
        .insert([{
          name: body.name || "",
          email: body.email || "",
          phone: body.phone || "",
          pickup: body.pickup || "",
          amount: Number(body.amount) || 0,
          painting: body.items || [] 
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.log("SUPABASE ERROR:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ ok: true });

    } catch (e) {
      console.log("SERVER ERROR:", e);
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: "Only GET/POST allowed" });
};

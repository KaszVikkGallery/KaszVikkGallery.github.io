const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
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
      const body =
        typeof req.body === "string"
          ? JSON.parse(req.body)
          : req.body || {};

      console.log("POST BODY:", body);

      const items = Array.isArray(body.items)
        ? body.items.map(i => ({
            name: i.name || "",
            price: Number(i.price) || 0
          }))
        : [];

      const order = {
        name: body.name || "",
        email: body.email || "",
        phone: body.phone || "",
        pickup: body.pickup || "",
        amount: Number(body.amount) || 0,
        items: items,
        created_at: new Date().toISOString()
      };

      console.log("ORDER TO INSERT:", order);

      const { data, error } = await supabase
        .from("orders")
        .insert([order])
        .select("*"); // 🔥 visszaadja amit beszúrt

      if (error) {
        console.log("SUPABASE INSERT ERROR:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({
        ok: true,
        inserted: data
      });
    }

    return res.status(405).json({ error: "Only GET/POST allowed" });

  } catch (e) {
    console.log("FATAL SERVER ERROR:", e);
    return res.status(500).json({ error: e.message });
  }
};

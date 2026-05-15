const { createClient } = require("@supabase/supabase-js");

console.log("ORDERS API RUNNING");

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

      console.log("GET REQUEST");

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      console.log("GET DATA:", data);
      console.log("GET ERROR:", error);

      if (error) {
        return res.status(500).json({
          ok: false,
          error: error.message
        });
      }

      return res.status(200).json({
        ok: true,
        orders: data || []
      });
    }

    // ---------------- POST ----------------
    if (req.method === "POST") {

      console.log("POST REQUEST");

      const body =
        typeof req.body === "string"
          ? JSON.parse(req.body)
          : req.body || {};

      console.log("BODY:", body);

      const items = Array.isArray(body.items)
        ? body.items.map(i => ({
            name: String(i.name || ""),
            price: Number(i.price || 0)
          }))
        : [];

      const order = {
        name: String(body.name || ""),
        email: String(body.email || ""),
        phone: String(body.phone || ""),
        pickup: String(body.pickup || ""),
        amount: Number(body.amount || 0),
        items,
        created_at: new Date().toISOString()
      };

      console.log("ORDER:", order);

      const { data, error } = await supabase
        .from("orders")
        .insert([order])
        .select();

      console.log("INSERT DATA:", data);
      console.log("INSERT ERROR:", error);

      if (error) {
        return res.status(500).json({
          ok: false,
          error: error.message
        });
      }

      return res.status(200).json({
        ok: true,
        inserted: data
      });
    }

    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });

  } catch (e) {

    console.log("FATAL ERROR:", e);

    return res.status(500).json({
      ok: false,
      error: e.message
    });
  }
};

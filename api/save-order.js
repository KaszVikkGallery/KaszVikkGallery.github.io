const { createClient } = require("@supabase/supabase-js");

// 🚨 FONTOS: client csak egyszer, de SAFE beállítással
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    db: {
      schema: "public"
    },
    auth: {
      persistSession: false
    },
    realtime: {
      enabled: false
    }
  }
);

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {

    // 🔥 GET (ADMIN)
    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.log("SUPABASE GET ERROR:", error);
        throw error;
      }

      return res.status(200).json(data);
    }

    // 🔥 POST (ORDER SAVE)
    if (req.method === "POST") {
      const body =
        typeof req.body === "string"
          ? JSON.parse(req.body)
          : req.body || {};

      const { error } = await supabase
        .from("orders")
        .insert([
          {
            name: body.name || "",
            email: body.email || "",
            phone: body.phone || "",
            pickup: body.pickup || "",
            amount: body.amount || 0,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) {
        console.log("SUPABASE INSERT ERROR:", error);
        throw error;
      }

      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Only GET/POST allowed" });

  } catch (err) {
    console.log("FATAL ERROR:", err);

    return res.status(500).json({
      error: err.message || "Unknown error"
    });
  }
};

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

        return res.status(500).json({
          error: error.message
        });
      }

      return res.status(200).json(data || []);
    }

    // ---------------- POST ----------------
    if (req.method === "POST") {

      const body =
        typeof req.body === "string"
          ? JSON.parse(req.body)
          : req.body || {};

      /* ITEMS */
      const items =
        Array.isArray(body.items)
          ? body.items
          : [];

      /* BASIC VALIDATION */
      if (
        !body.name ||
        !body.email ||
        !body.phone ||
        !body.pickup
      ) {

        return res.status(400).json({
          error: "Missing required fields"
        });

      }

      /* ORDER */
      const order = {

        name: String(body.name).trim(),

        email: String(body.email).trim(),

        phone: String(body.phone).trim(),

        pickup: String(body.pickup).trim(),

        /*
          FONTOS:
          Frontend amount nem megbízható.
          Backend számolja majd újra.
        */
        amount: null,

        items: items

      };

      const { data, error } = await supabase
        .from("orders")
        .insert([order])
        .select();

      if (error) {

        console.log("SUPABASE ERROR:", error);

        return res.status(500).json({
          error: error.message
        });

      }

      return res.status(200).json({
        ok: true,
        inserted: data
      });

    }

    return res.status(405).json({
      error: "Only GET/POST allowed"
    });

  } catch (e) {

    console.log("SERVER ERROR:", e);

    return res.status(500).json({
      error: e.message
    });

  }

};

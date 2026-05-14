import fs from "fs";

export default async function handler(req, res) {
  const filePath = "/tmp/orders.json";

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // 🔥 LEKÉRÉS
    if (req.method === "GET") {
      if (!fs.existsSync(filePath)) {
        return res.status(200).json([]);
      }

      const data = fs.readFileSync(filePath, "utf8");

      return res.status(200).json(JSON.parse(data || "[]"));
    }

    // 🔥 MENTÉS
    if (req.method === "POST") {
      let body = req.body;

      if (!body) body = {};
      if (typeof body === "string") body = JSON.parse(body);

      let orders = [];

      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, "utf8");
        orders = JSON.parse(data || "[]");
      }

      orders.push({
        ...body,
        time: new Date().toISOString()
      });

      fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));

      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Only GET/POST allowed" });

  } catch (err) {
    console.log("SAVE ORDER ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}

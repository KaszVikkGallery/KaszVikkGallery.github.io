import fs from "fs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    let body = req.body;

    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    const filePath = "/tmp/orders.json";

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

  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
}

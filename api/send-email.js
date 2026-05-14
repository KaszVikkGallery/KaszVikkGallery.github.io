const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {

  // CORS (nagyon fontos Vercelnél)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    let body = req.body;

    if (!body) body = {};
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: "Invalid JSON body" });
      }
    }

    const amount = body.amount || 0;
    const name = body.name || "-";
    const email = body.email || "-";
    const phone = body.phone || "-";
    const pickup = body.pickup || "-";

    console.log("EMAIL ORDER:", { amount, name, email, phone, pickup });

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const result = await resend.emails.send({
      from: "Rendelés <onboarding@resend.dev>",
      to: "kaszvikkfestmeny@gmail.com",
      subject: "Új rendelés érkezett",
      html: `
        <h2>Új rendelés</h2>
        <p><b>Név:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Telefon:</b> ${phone}</p>
        <p><b>Packeta:</b> ${pickup}</p>
        <p><b>Összeg:</b> ${amount} Ft</p>
      `
    });

    return res.status(200).json({
      ok: true,
      result
    });

  } catch (err) {
    console.log("EMAIL ERROR:", err);

    return res.status(500).json({
      error: err.message || "Unknown error"
    });
  }
};

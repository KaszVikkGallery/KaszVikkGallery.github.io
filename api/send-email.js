const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {

    let body = req.body;
    if (!body) body = {};
    if (typeof body === "string") body = JSON.parse(body);

    const { amount, name, email, phone, pickup } = body;

    console.log("EMAIL ORDER:", body);

    await resend.emails.send({
      from: "Rendelés <onboarding@resend.dev>",
      to: "kaszvikkfestmeny@gmail.com",
      subject: "Új sikeres rendelés",
      html: `
        <h2>Új rendelés sikeres fizetés után</h2>
        <p><b>Név:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Telefon:</b> ${phone}</p>
        <p><b>Packeta:</b> ${pickup}</p>
        <p><b>Összeg:</b> ${amount} Ft</p>
      `
    });

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.log("EMAIL ERROR:", err);

    return res.status(500).json({
      error: err.message
    });
  }
};

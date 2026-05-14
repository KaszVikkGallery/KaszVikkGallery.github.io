const Stripe = require("stripe");
const { Resend } = require("resend");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {

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

    const { amount, name, email, phone, pickup } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // 🔥 EMAIL NEKED (RENDELÉS ÉRTESÍTÉS)
    await resend.emails.send({
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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "huf",
            product_data: {
              name: "Kasz Vikk rendelés",
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],

      success_url: "https://kaszvikkgallery.github.io/success.html",
      cancel_url: "https://kaszvikkgallery.github.io/cancel.html",
    });

    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.log("ERROR:", err);

    return res.status(500).json({
      error: err.message,
    });
  }
};

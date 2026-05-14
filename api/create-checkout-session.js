const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

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

    let body = req.body;

    if (!body) body = {};
    if (typeof body === "string") body = JSON.parse(body);

    const { amount } = body;

    console.log("BODY:", body);

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }
    console.log("NEW ORDER:");
console.log({
  amount,
  name,
  email,
  phone,
  pickup
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

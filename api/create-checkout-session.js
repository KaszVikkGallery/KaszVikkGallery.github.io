import Stripe from "stripe";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  let body = req.body;

  // 🔥 FIX: biztos JSON parse
  if (!body || typeof body === "string") {
    try {
      body = JSON.parse(body || "{}");
    } catch (e) {
      body = {};
    }
  }

  const amount = Number(body.amount);

  if (!amount) {
    return res.status(400).json({ error: "Missing amount" });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: "ENV VARIABLE MISSING" });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "huf",
          product_data: { name: "Kasz Vikk festmény" },
          unit_amount: Math.round(amount),
        },
        quantity: 1,
      }],
      success_url: "https://kaszvikkgallery.github.io/",
      cancel_url: "https://kaszvikkgallery.github.io/",
    });

    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
}

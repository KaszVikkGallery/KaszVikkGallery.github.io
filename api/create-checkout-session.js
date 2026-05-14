import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // CORS fejlécek
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // FONTOS: OPTIONS kezelés
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // csak POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    console.log("Checkout session indul");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "huf",
            product_data: {
              name: "Kasz Vikk termék",
            },
            unit_amount: 1000,
          },
          quantity: 1,
        },
      ],
      success_url: "https://kaszvikkgallery.github.io/success.html",
      cancel_url: "https://kaszvikkgallery.github.io/cancel.html",
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe hiba:", err);
    return res.status(500).json({ error: err.message });
  }
}

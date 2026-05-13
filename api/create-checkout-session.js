export const config = {
  runtime: "nodejs",
};

import Stripe from "stripe";

export default async function handler(req, res) {
  try {
    // Only POST allowed
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST allowed" });
    }

    // Init Stripe HERE (after runtime fix)
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Safely read body
    const body = req.body || {};
    const amount = Number(body.amount);

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        error: "Invalid amount",
        received: body,
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "huf",
            product_data: {
              name: "Kasz Vikk festmény rendelés",
            },
            unit_amount: Math.round(amount),
          },
          quantity: 1,
        },
      ],
      success_url: "https://kaszvikkgallery.github.io/",
      cancel_url: "https://kaszvikkgallery.github.io/",
    });

    // Return checkout URL
    return res.status(200).json({
      url: session.url,
    });

  } catch (err) {
    console.log("STRIPE ERROR:", err);

    return res.status(500).json({
      error: err.message,
    });
  }
}

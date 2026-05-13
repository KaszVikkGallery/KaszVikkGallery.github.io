import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST allowed" });
    }

    const body = req.body || {};
    const amount = body.amount;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: "Invalid amount", body });
    }

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

    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.log("Stripe error:", err);
    return res.status(500).json({ error: err.message });
  }
}

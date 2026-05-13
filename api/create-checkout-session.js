import Stripe from "stripe";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST allowed" });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    });

    const amount = Number(req.body?.amount);

    if (!amount) {
      return res.status(400).json({ error: "Missing amount" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "huf",
            product_data: {
              name: "Kasz Vikk festmény",
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
    console.log("ERROR:", err);

    return res.status(500).json({
      error: err.message,
      type: err.type,
    });
  }
}

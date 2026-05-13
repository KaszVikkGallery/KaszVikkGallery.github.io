import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { amount } = req.body;

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
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: "https://kaszvikkgallery.github.io/",
      cancel_url: "https://kaszvikkgallery.github.io/",
    });

    res.status(200).json({ url: session.url });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

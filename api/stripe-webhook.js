import Stripe from "stripe";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const event = req.body;

    // csak sikeres fizetés
    if (event.type !== "checkout.session.completed") {
      return res.status(200).json({ received: true });
    }

    const session = event.data.object;

    // 🔥 FONTOS: innen jön a TE adataid
    const name = session.metadata?.name || "-";
    const email = session.metadata?.email || session.customer_details?.email || "-";
    const phone = session.metadata?.phone || "-";
    const pickup = session.metadata?.pickup || "-";

    const amount = (session.amount_total || 0) / 100;

    console.log("ORDER RECEIVED:", {
      name,
      email,
      phone,
      pickup,
      amount
    });

    await resend.emails.send({
      from: "Rendelés <onboarding@resend.dev>",
      to: "kaszvikkfestmeny@gmail.com",
      subject: "Új rendelés (Stripe)",
      html: `
        <h2>Új rendelés érkezett</h2>
        <p><b>Név:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Telefon:</b> ${phone}</p>
        <p><b>Packeta:</b> ${pickup}</p>
        <p><b>Összeg:</b> ${amount} Ft</p>
      `
    });

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.log("WEBHOOK ERROR:", err);
    return res.status(500).json({ error: err.message || "Unknown error" });
  }
}

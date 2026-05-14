import Stripe from "stripe";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const chunks = [];

    for await (const chunk of req) {
      chunks.push(chunk);
    }

    const rawBody = Buffer.concat(chunks).toString("utf8");
    const event = JSON.parse(rawBody);

    console.log("WEBHOOK EVENT:", event.type);

    if (event.type !== "checkout.session.completed") {
      return res.status(200).json({ received: true });
    }

    const session = event.data.object;

    const name = session.metadata?.name || "-";
    const email = session.metadata?.email || "-";
    const phone = session.metadata?.phone || "-";
    const pickup = session.metadata?.pickup || "-";
    const amount = (session.amount_total || 0) / 100;

    await resend.emails.send({
      from: "Rendelés <onboarding@resend.dev>",
      to: "kaszvikkfestmeny@gmail.com",
      subject: "Új rendelés",
      html: `
        <h2>Új rendelés</h2>
        <p>Név: ${name}</p>
        <p>Email: ${email}</p>
        <p>Telefon: ${phone}</p>
        <p>Packeta: ${pickup}</p>
        <p>Összeg: ${amount} Ft</p>
      `
    });

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.log("WEBHOOK ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}

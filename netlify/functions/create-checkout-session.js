const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { Resend } = require("resend");

const resend = new Resend("re_by43TEX9_C3TRW9Hc6YSNNqDNfDmSiyix");

exports.handler = async (event) => {
  try {

    const data = JSON.parse(event.body);

    const amount = Number(data.amount);

    // STRIPE CHECKOUT
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [{
        price_data: {
          currency: "huf",
          product_data: {
            name: "Kasz Vikk festmények"
          },
          unit_amount: amount * 100
        },
        quantity: 1
      }],

      success_url: `${process.env.URL}/success.html`,
      cancel_url: `${process.env.URL}/checkout.html`
    });

    // EMAIL NEKED
    await resend.emails.send({
      from: "Kasz Vikk Webshop <onboarding@resend.dev>",
      to: "Kaszvikkfestmeny@gmail.com",
      subject: "Új rendelés érkezett",
      html: `
        <h2>Új rendelés</h2>

        <p><b>Név:</b> ${data.name}</p>
        <p><b>Email:</b> ${data.email}</p>
        <p><b>Telefon:</b> ${data.phone}</p>
        <p><b>Packeta pont:</b> ${data.pickup}</p>
        <p><b>Összeg:</b> ${amount} Ft</p>
      `
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};

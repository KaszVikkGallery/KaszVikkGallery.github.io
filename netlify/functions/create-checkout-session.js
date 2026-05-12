const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {

    const data = JSON.parse(event.body);
    const amount = Number(data.amount);

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

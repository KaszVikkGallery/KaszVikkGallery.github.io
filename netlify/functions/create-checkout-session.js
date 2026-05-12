const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {

  try {

    const body = JSON.parse(event.body);

    const amount = body.amount;
    const name = body.name;
    const email = body.email;
    const phone = body.phone;
    const pickup = body.pickup;

    const session = await stripe.checkout.sessions.create({

      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "huf",
            product_data: {
              name: "Kasz Vikk festmények",
              description: `Vásárló: ${name} | Tel: ${phone} | Packeta: ${pickup}`
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],

      mode: "payment",

      customer_email: email,

      success_url: "https://merry-capybara-be7100.netlify.app/success.html",

      cancel_url: "https://merry-capybara-be7100.netlify.app/checkout.html",

    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        url: session.url,
      }),
    };

  } catch (err) {

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message,
      }),
    };

  }
};

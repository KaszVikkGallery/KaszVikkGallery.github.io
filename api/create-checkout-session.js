const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async function handler(req, res) {

if(req.method !== "POST"){
return res.status(405).json({
error: "Only POST allowed"
});
}

try {

const amount = Number(req.body.amount);

if(!amount || amount <= 0){
return res.status(400).json({
error: "Invalid amount"
});
}

const session = await stripe.checkout.sessions.create({
payment_method_types: ["card"],

mode: "payment",

line_items: [
{
price_data: {
currency: "huf",

product_data: {
name: "Kasz Vikk rendelés",
},

unit_amount: Math.round(amount * 100),
},

quantity: 1,
},
],

success_url:
"https://kaszvikkgallery.github.io/success.html",

cancel_url:
"https://kaszvikkgallery.github.io/cancel.html",
});

return res.status(200).json({
url: session.url
});

} catch(err){

console.log("STRIPE ERROR:", err);

return res.status(500).json({
error: err.message
});
}
};

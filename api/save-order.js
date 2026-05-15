const { createClient } = require("@supabase/supabase-js");

module.exports = async function handler(req, res) {

res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
res.setHeader("Access-Control-Allow-Headers", "Content-Type");

if (req.method === "OPTIONS") {
return res.status(200).end();
}

const supabase = createClient(
process.env.SUPABASE_URL,
process.env.SUPABASE_SERVICE_KEY
);

try {

// ---------------- GET ----------------  
const { data, error } = await supabase
  .from("orders")
  .insert([order])
  .select();

if (error) {
  console.log("❌ INSERT ERROR:", error);
  return res.status(500).json({ error: error.message });
}

console.log("✅ INSERT SUCCESS:", data);

return res.status(200).json({
  ok: true,
  inserted: data
});

// ---------------- POST ----------------  
if (req.method === "POST") {  

  const body =  
    typeof req.body === "string"  
      ? JSON.parse(req.body)  
      : req.body || {};  

  console.log("POST BODY:", body);  

  // 🔥 FONTOS: items NEM nyúlunk át, csak elmentjük  
  const items = Array.isArray(body.items) ? body.items : [];  

  const order = {  
    name: body.name || "",  
    email: body.email || "",  
    phone: body.phone || "",  
    pickup: body.pickup || "",  
    amount: Number(body.amount) || 0,  

    // 🔥 EZ A LÉNYEG  
    items: items  
  };  

  const { data, error } = await supabase  
    .from("orders")  
    .insert([order])  
    .select();  

  if (error) {  
    console.log("SUPABASE ERROR:", error);  
    return res.status(500).json({ error: error.message });  
  }  

  return res.status(200).json({  
    ok: true,  
    inserted: data  
  });  
}  

return res.status(405).json({ error: "Only GET/POST allowed" });

} catch (e) {

console.log("SERVER ERROR:", e);  

return res.status(500).json({ error: e.message });

}
};

let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* ===== MENTÉS ===== */
function saveCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

/* ===== HOZZÁADÁS ===== */
function addToCart(name, price){

  const existing = cart.find(i => i.name === name);

  if(existing){
    existing.qty += 1;
  } else {
    cart.push({name, price, qty:1});
  }

  saveCart();
}

/* ===== TÖRLÉS ===== */
function removeItem(name){
  cart = cart.filter(i => i.name !== name);
  saveCart();
}

/* ===== MENNYISÉG ===== */
function changeQty(name, amount){
  const item = cart.find(i => i.name === name);
  if(!item) return;

  item.qty += amount;

  if(item.qty <= 0){
    removeItem(name);
  }

  saveCart();
}

/* ===== KOSÁR SZÁMLÁLÓ ===== */
function getCount(){
  return cart.reduce((sum,i)=>sum+i.qty,0);
}

/* ===== UI FRISSÍTÉS ===== */
function updateCartUI(){

  const el = document.getElementById("cartCount");
  if(el) el.innerText = getCount();

  renderCartDrawer();
}

/* ===== KOSÁR MEGJELENÍTÉS ===== */
function renderCartDrawer(){

  const box = document.getElementById("cartItems");
  if(!box) return;

  box.innerHTML = "";

  let total = 0;

  cart.forEach(i => {

    total += i.price * i.qty;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <div>
        <div style="font-size:20px">${i.name}</div>
        <div style="font-size:18px;color:#666">
          ${i.price} Ft × ${i.qty}
        </div>
      </div>

      <div>
        <button onclick="changeQty('${i.name}', -1)">-</button>
        <button onclick="changeQty('${i.name}', 1)">+</button>
        <span onclick="removeItem('${i.name}')"
        style="color:red;cursor:pointer;font-size:22px;margin-left:10px">✕</span>
      </div>
    `;

    box.appendChild(div);

  });

  const shipping = parseInt(document.getElementById("shipping")?.value || 0);

  const totalEl = document.getElementById("total");
  if(totalEl){
    totalEl.innerText = "Összesen: " + (total + shipping) + " Ft";
  }
}

/* ===== INIT ===== */
document.addEventListener("DOMContentLoaded", updateCartUI); 

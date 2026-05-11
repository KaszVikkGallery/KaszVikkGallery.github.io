let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* ===== MENTÉS ===== */
function saveCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

/* ===== HOZZÁADÁS ===== */
function addToCart(name, price){

  const item = cart.find(i => i.name === name);

  if(item){
    item.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  saveCart();
}

/* ===== TÖRLÉS ===== */
function removeItem(name){
  cart = cart.filter(i => i.name !== name);
  saveCart();
}

/* ===== ÖSSZESÍTÉS ===== */
function getTotal(){
  return cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
}

/* ===== SZÁMLÁLÓ ===== */
function updateCartCount(){
  const el = document.getElementById("cartCount");
  if(el){
    el.innerText = cart.reduce((sum, i) => sum + i.qty, 0);
  }
}

/* ===== KOSÁR UI ===== */
function updateCart(){

  updateCartCount();

  const list = document.getElementById("cartItems");
  const totalEl = document.getElementById("total");
  const shippingEl = document.getElementById("shipping");

  if(list){
    list.innerHTML = "";

    cart.forEach(i => {
      const div = document.createElement("div");

      div.className = "cart-item";

      div.innerHTML = `
        <div>
          <div>${i.name} x${i.qty}</div>
          <div>${i.price * i.qty} Ft</div>
        </div>
        <button onclick="removeItem('${i.name}')">✕</button>
      `;

      list.appendChild(div);
    });
  }

  if(totalEl){
    const shipping = shippingEl ? parseInt(shippingEl.value) || 0 : 0;
    totalEl.innerText = "Összesen: " + (getTotal() + shipping) + " Ft";
  }
}

/* ===== KOSÁR NYITÁS ===== */
function toggleCart(){
  document.getElementById("cartDrawer")?.classList.toggle("open");
  document.getElementById("cartOverlay")?.classList.toggle("show");
  updateCart();
}

/* ===== CHECKOUT ===== */
function checkout(){

  if(cart.length === 0){
    alert("A kosár üres");
    return;
  }

  const shipping = document.getElementById("shipping")?.value || "0";

  if(shipping === "0"){
    alert("Válassz szállítást");
    return;
  }

  alert("Stripe ide fog menni");
}

/* ===== START ===== */
document.addEventListener("DOMContentLoaded", updateCart);

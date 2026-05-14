function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function showToast(message) {
  let container = document.getElementById("toastContainer");
  if (!container) return;

  let toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  container.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

function addToCart(name, price) {
  let cart = getCart();
  let existing = cart.find(item => item.name === name);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({name, price, qty: 1});
  }

  saveCart(cart);
  showToast(name + " added to cart");
}

// Modal variables
let currentModalProduct = {
  name: '',
  price: 0,
  qty: 1
};

function openProductModal(name, price, element) {
  currentModalProduct = { name, price, qty: 1 };
  
  document.getElementById('modalProductName').textContent = name;
  document.getElementById('modalProductPrice').textContent = '₱' + price;
  document.getElementById('modalProductImage').src = element.querySelector('img').src;
  document.getElementById('modalQty').textContent = 1;
  
  const modal = document.getElementById('productModal');
  modal.classList.add('open');
}

function closeProductModal(event) {
  // Only close if clicking on the background (modal itself), not the content
  if (event.target.id === 'productModal') {
    document.getElementById('productModal').classList.remove('open');
    currentModalProduct = { name: '', price: 0, qty: 1 };
  }
}

function increaseModalQty() {
  currentModalProduct.qty++;
  document.getElementById('modalQty').textContent = currentModalProduct.qty;
}

function decreaseModalQty() {
  if (currentModalProduct.qty > 1) {
    currentModalProduct.qty--;
    document.getElementById('modalQty').textContent = currentModalProduct.qty;
  }
}

function addModalProductToCart() {
  let cart = getCart();
  let existing = cart.find(item => item.name === currentModalProduct.name);

  if (existing) {
    existing.qty += currentModalProduct.qty;
  } else {
    cart.push({
      name: currentModalProduct.name,
      price: currentModalProduct.price,
      qty: currentModalProduct.qty
    });
  }

  saveCart(cart);
  showToast(currentModalProduct.name + " added to cart");
  
  // Close the modal
  document.getElementById('productModal').classList.remove('open');
  currentModalProduct = { name: '', price: 0, qty: 1 };
}

function updateCartUI() {
  let cart = getCart();
  let total = 0;
  let list = document.getElementById("cartList");
  let emptyMessage = document.getElementById("emptyMessage");
  let cartContainer = document.getElementById("cartContainer");
  let checkoutSection = document.getElementById("checkoutSection");

  if (!list) return;

  if (cart.length === 0) {
    emptyMessage.style.display = "block";
    cartContainer.style.display = "none";
    if (checkoutSection) checkoutSection.style.display = "none";
    return;
  }

  emptyMessage.style.display = "none";
  cartContainer.style.display = "block";
  if (checkoutSection) checkoutSection.style.display = "flex";
  list.innerHTML = "";

  cart.forEach((item, i) => {
    total += item.price * item.qty;

    list.innerHTML += `
      <div class="product" style="min-width:250px;">
        <div style="background:#f0f0f0; height:150px; border-radius:10px; display:flex; align-items:center; justify-content:center; margin-bottom:10px; color:#999;">
          Product Image
        </div>
        <h3 style="margin:8px 0 4px; font-size:16px;">${item.name}</h3>
        <p style="margin:0 0 10px 0; color:#666; font-size:14px;">₱${item.price}</p>
        <div class="qty-controls" style="display:flex; gap:10px; align-items:center; margin-top:auto;">
          <button class="qty-btn" onclick="decreaseQty(${i})">−</button>
          <span style="font-weight:bold; min-width:30px; text-align:center;">${item.qty}</span>
          <button class="qty-btn" onclick="increaseQty(${i})">+</button>
          <button class="qty-btn" onclick="removeFromCart(${i})" style="margin-left:auto; background:#dc2626;">Remove</button>
        </div>
      </div>
    `;
  });

  document.getElementById("total").textContent = total;
}

function removeFromCart(i) {
  let cart = getCart();
  cart.splice(i, 1);
  saveCart(cart);
  updateCartUI();
}

function increaseQty(i) {
  let cart = getCart();
  cart[i].qty++;
  saveCart(cart);
  updateCartUI();
}

function decreaseQty(i) {
  let cart = getCart();

  if (cart[i].qty > 1) {
    cart[i].qty--;
  } else {
    cart.splice(i, 1);
  }

  saveCart(cart);
  updateCartUI();
}

function placeOrder() {
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();

  if (!fullName) {
    showErrorModal("Full Name is required");
    return;
  }
  if (!email) {
    showErrorModal("Email is required");
    return;
  }
  if (!phone) {
    showErrorModal("Phone Number is required");
    return;
  }
  if (!address) {
    showErrorModal("Address is required");
    return;
  }

  localStorage.removeItem("cart");
  window.location.href = "success.html";
}

function showErrorModal(message) {
  document.getElementById("errorMessage").textContent = message;
  document.getElementById("errorModal").style.display = "block";
  document.getElementById("errorOverlay").style.display = "block";
  
  // Auto-close after 5 seconds
  setTimeout(() => {
    closeErrorModal();
  }, 5000);
}

function closeErrorModal() {
  document.getElementById("errorModal").style.display = "none";
  document.getElementById("errorOverlay").style.display = "none";
}

function displayCheckoutOrder() {
  let cart = getCart();
  let orderList = document.getElementById("orderList");
  let checkoutTotal = document.getElementById("checkoutTotal");
  let total = 0;

  if (!orderList) return;

  if (cart.length === 0) {
    orderList.innerHTML = '<p style="font-size:20px; color:#999;">Your cart is empty. <a href="cart.html">Go back to cart</a></p>';
    return;
  }

  let html = '';
  cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    html += `
      <div style="background:white; padding:20px; border-radius:8px; margin-bottom:15px; display:flex; justify-content:space-between; align-items:center; font-size:18px;">
        <div>
          <h3 style="margin:0 0 8px 0; font-size:24px;">${item.name}</h3>
          <p style="margin:0; color:#666;">Qty: <span style="font-weight:bold; font-size:20px;">${item.qty}</span></p>
        </div>
        <div style="text-align:right;">
          <p style="margin:0; color:#666; font-size:16px;">₱${item.price} each</p>
          <p style="margin:8px 0 0 0; font-weight:bold; font-size:22px; color:#22c55e;">₱${itemTotal}</p>
        </div>
      </div>
    `;
  });

  orderList.innerHTML = html;
  checkoutTotal.textContent = total;
}

// function scrollRow(btn, direction) {
//   const container = btn.parentElement.querySelector(".grid");

//   const scrollAmount = 220; // card width

//   container.scrollBy({
//     left: direction * scrollAmount,
//     behavior: "smooth"
//   });
// }

function scrollRow(btn, direction) {
  const container = btn.parentElement.querySelector(".grid");
  const scrollAmount = 220;

  container.scrollBy({
    left: direction * scrollAmount,
    behavior: "smooth"
  });

  // LOOP CHECK
  setTimeout(() => {
    if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 5) {
      // reached end → reset to start
      container.scrollLeft = 0;
    }

    if (container.scrollLeft <= 0) {
      // reached start → jump to end
      container.scrollLeft = container.scrollWidth;
    }
  }, 300);
}

/* DUPLICATE ITEMS FOR LOOP EFFECT */
function duplicateItems() {
  document.querySelectorAll(".grid").forEach(grid => {
    grid.innerHTML += grid.innerHTML; // duplicate content
  });
}

window.onload = function () {
  duplicateItems();
  if (typeof updateCartUI === "function") {
    updateCartUI();
  }
};


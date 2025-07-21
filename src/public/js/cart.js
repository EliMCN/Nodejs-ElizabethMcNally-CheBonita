document.addEventListener("DOMContentLoaded", () => {
  actualizarNumeroCarrito();
  renderCart();

  const clearCartBtn = document.getElementById("clear-cart-btn");
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      Swal.fire({
        title: '¿Vaciar carrito?',
        text: 'Se eliminarán todos los productos',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, vaciar',
        cancelButtonText: 'Cancelar'
      }).then(result => {
        if (result.isConfirmed) {
          reiniciarCarrito();
          Swal.fire('Carrito vaciado', '', 'success');
        }
      });
    });
  }

  const checkoutBtn = document.getElementById("checkout-btn");
  const checkoutFormContainer = document.getElementById("checkout-form-container");
  const checkoutForm = document.getElementById("checkout-form");
  const successMessage = document.getElementById("success-message");

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      checkoutFormContainer.classList.remove("hidden");
    });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const customerName = document.getElementById("customer-name").value.trim();
      const customerEmail = document.getElementById("customer-email").value.trim();
      const customerAddress = document.getElementById("customer-address").value.trim();
      const paymentMethod = document.getElementById("payment-method").value;

      if (!customerName || !customerEmail || !customerAddress || !paymentMethod) {
        Swal.fire('Campos incompletos', 'Por favor completa todos los campos.', 'warning');
        return;
      }

      console.log("Enviando datos de compra...", {
        customerName,
        customerEmail,
        customerAddress,
        paymentMethod,
      });

      localStorage.removeItem("cart");
      actualizarNumeroCarrito();
      renderCart();
// Usamos la función centralizada para asegurar que se notifiquen los cambios y se renderice todo.
      reiniciarCarrito();
      checkoutFormContainer.classList.add("hidden");
      successMessage.classList.remove("hidden");

      Swal.fire('¡Compra exitosa!', 'Gracias por tu pedido.', 'success');
    });
  }
});

// Funciones auxiliares
function getFromStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  // Despachamos un evento global para que otras partes de la UI (como el header)
  // puedan reaccionar a los cambios en el carrito.
  window.dispatchEvent(new CustomEvent('cartUpdated'));
}

function actualizarNumeroCarrito() {
  const cart = getFromStorage("cart");
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const cartCount = document.getElementById("cartCount");
  if (!cartCount) return; // Salir si el elemento no existe (ej. en páginas sin header)

  cartCount.innerText = totalItems;
  cartCount.classList.toggle("d-none", totalItems === 0);
}


function renderCart() {
  const cartContainer = document.querySelector(".cart-list");
  const cartProducts = getFromStorage("cart");
  if (!cartContainer) return;

  if (cartProducts.length === 0) {
    cartContainer.innerHTML = "<tr><td colspan='6' class='text-center'>El carrito está vacío.</td></tr>";
    document.getElementById("cart-total").innerText = "0.00";
    return;
  }

  let total = 0;
  cartContainer.innerHTML = cartProducts.map(product => {
    const subtotal = product.price * product.quantity;
    total += subtotal;
    return renderCartItem(product);
  }).join("");

  document.getElementById("cart-total").innerText = total.toFixed(2);

  document.querySelectorAll(".update-quantity").forEach(button => {
    button.addEventListener("click", (e) => {
      const { uniqueId, delta } = e.target.dataset;
      updateQuantity(uniqueId, parseInt(delta, 10));
    });
  });

  document.querySelectorAll(".remove-from-cart").forEach(button => {
    button.addEventListener("click", (e) => {
      const { uniqueId } = e.target.dataset;
      removeFromCart(uniqueId);
    });
  });
}

function renderCartItem(product) {
  const subtotal = (product.price * product.quantity).toFixed(2);
  return `
    <tr>
      <td><img src="${product.image}" alt="${product.title}" class="img-fluid" style="max-width: 100px;"></td>
      <td>${product.title}</td>
      <td>$${product.price.toFixed(2)}</td>
      <td>
        <button class="btn btn-sm btn-outline-secondary update-quantity" data-unique-id="${product.uniqueId}" data-delta="-1">-</button>
        <span class="mx-2">${product.quantity}</span>
        <button class="btn btn-sm btn-outline-secondary update-quantity" data-unique-id="${product.uniqueId}" data-delta="1">+</button>
      </td>
      <td>$${subtotal}</td>
      <td>
        <button class="btn btn-sm btn-danger remove-from-cart" data-unique-id="${product.uniqueId}">Eliminar</button>
      </td>
    </tr>
  `;
}

function updateQuantity(uniqueId, delta) {
  const cart = getFromStorage("cart");
  const productInCart = cart.find(item => item.uniqueId === uniqueId);
  if (!productInCart) return;

  productInCart.quantity += delta;

  if (productInCart.quantity < 1) {
    removeFromCart(uniqueId);
  } else {
    saveToStorage("cart", cart);
    renderCart();
    actualizarNumeroCarrito();
  }
}

function removeFromCart(uniqueId) {
  const updatedCart = getFromStorage("cart").filter(item => item.uniqueId !== uniqueId);
  saveToStorage("cart", updatedCart);
  renderCart();
  actualizarNumeroCarrito();
}

function addToCart({ id, title, price, image }) {
  const cart = getFromStorage("cart");
  const uniqueId = `${id}-${price}`;
  const productInCart = cart.find(item => item.uniqueId === uniqueId);

  if (productInCart) {
    productInCart.quantity++;
  } else {
    cart.push({ uniqueId, title, price, image, quantity: 1 });
  }

  saveToStorage("cart", cart);
  actualizarNumeroCarrito();

  Swal.fire({
    title: "¡Producto agregado!",
    text: `${title} ha sido añadido al carrito.`,
    icon: "success",
    confirmButtonText: "Continuar",
    timer: 3000,
  });
}

function reiniciarCarrito() {
  localStorage.removeItem("cart");
  // Despachamos un evento global para que el header se actualice.
  window.dispatchEvent(new CustomEvent('cartUpdated'));
  actualizarNumeroCarrito();
  renderCart();
}

export {
  addToCart,
  actualizarNumeroCarrito,
  reiniciarCarrito,
  renderCart,
  getFromStorage,
  saveToStorage,
};

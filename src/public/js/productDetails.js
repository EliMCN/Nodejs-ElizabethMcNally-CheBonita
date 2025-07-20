import { normalizeProduct } from './normalizers.js';
import { addToCart } from './cart.js';

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loading");
  loadProductDetails().finally(() => {
    console.log("🔁 Finalizando carga, ocultando spinner...");
    document.body.classList.remove("loading");
  });
});

async function loadProductDetails() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
    if (!productId) throw new Error("ID de producto no especificado");

    const response = await fetch(`/api/products/${productId}`);
    if (!response.ok) throw new Error("Producto no encontrado");

    const rawProduct = await response.json();
    const product = normalizeProduct(rawProduct);

    // Cargar imagen principal y esperar su carga
    const productImage = document.getElementById("product-image");
    productImage.src = product.image;

    await new Promise((resolve) => {
      if (productImage.complete) {
        resolve();
      } else {
        productImage.onload = resolve;
        productImage.onerror = resolve;
      }
    });

document.getElementById("product-title").textContent = product.title;
document.getElementById("product-description").textContent = product.description;

    if (product.category.includes("gift-cards")) {
      document.getElementById("product-price").textContent = "";
    } else {
      document.getElementById("product-price").textContent = `$${product.price.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
    }

    document.getElementById("product-stock").textContent =
      product.stock > 10  ? "En Stock"
    : product.stock > 0
    ? "Últimas unidades"
    : "Agotado";

    renderThumbnails(product.images);

    if (product.category.includes("gift-cards")) {
      handleGiftCard(product);
    } else {
      handleNormalProduct(product);
    }
  } catch (error) {
  console.error("Error al cargar el producto:", error.message);
    Swal.fire({
      icon: "error",
      title: "Producto no disponible",
      text: error.message || "No se pudo cargar el producto.",
    });
  }
}

// Thumbnails
function renderThumbnails(thumbnails) {
  const container = document.getElementById("thumbnail-container");
  container.innerHTML = "";
  thumbnails.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "Thumbnail";
    img.classList.add("thumbnail");
    img.addEventListener("click", () => {
      document.getElementById("product-image").src = src;
    });
    container.appendChild(img);
  });
}

// Producto normal
function handleNormalProduct(product) {
  const addToCartButton = document.getElementById("add-to-cart");
  const goToCartButton = document.getElementById("go-to-cart");

// Si no hay stock, deshabilitar el botón
  if (product.stock <= 0) {
    addToCartButton.disabled = true;
    addToCartButton.textContent = "Agotado";
    return;
  }


  function addToCartHandler() {
    const uniqueId = `${product.id}-${product.price}`;
    addToCart({
      id: uniqueId,
      title: product.title,
      price: product.price,
      image: product.image,
    });

    goToCartButton.style.display = "inline-block";
    goToCartButton.removeEventListener("click", goToCartHandler);
    goToCartButton.addEventListener("click", goToCartHandler);
  }

  function goToCartHandler() {
    window.location.href = "cart.html";
  }

  addToCartButton.removeEventListener("click", addToCartHandler);
  addToCartButton.addEventListener("click", addToCartHandler);
}

// Gift card
function handleGiftCard(product) {
  const giftCardOptions = document.getElementById("gift-card-options");
  giftCardOptions.style.display = "block";

  const valueSelect = document.getElementById("gift-card-value");
  const customInput = document.getElementById("custom-value");
  const selectedPrice = document.getElementById("selected-price");
  const addToCartButton = document.getElementById("add-to-cart");
  const goToCartButton = document.getElementById("go-to-cart");

  function addToCartHandler() {
    let price;
    const selected = valueSelect.value;

    if (selected === "custom") {
      price = parseLocaleNumber(customInput.value);
      if (isNaN(price) || price <= 0) {
        Swal.fire({
          title: "Precio inválido",
          text: "Por favor, ingresa un valor válido.",
          icon: "error",
        });
        return;
      }
    } else {
      price = parseFloat(selected);
    }

    const uniqueId = `${product.id}-${price}`;
    addToCart({
      id: uniqueId,
      title: product.title,
      price,
      image: product.image,
    });

    goToCartButton.style.display = "inline-block";
    goToCartButton.removeEventListener("click", goToCartHandler);
    goToCartButton.addEventListener("click", goToCartHandler);
  }

  function goToCartHandler() {
    window.location.href = "cart.html";
  }

  valueSelect.addEventListener("change", () => {
    const val = valueSelect.value;
    if (val === "custom") {
      customInput.style.display = "inline-block";
      selectedPrice.textContent = `$${customInput.value || 0}`;
    } else {
      customInput.style.display = "none";
      selectedPrice.textContent = `$${val}`;
    }
  });

  customInput.addEventListener("input", () => {
    const raw = customInput.value;
    const parsed = parseLocaleNumber(raw);
    selectedPrice.textContent = isNaN(parsed)
      ? "$0.00"
      : `$${parsed.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
  });

  addToCartButton.removeEventListener("click", addToCartHandler);
  addToCartButton.addEventListener("click", addToCartHandler);
}

function parseLocaleNumber(str) {
  return parseFloat(str.replace(/\./g, "").replace(",", "."));
}

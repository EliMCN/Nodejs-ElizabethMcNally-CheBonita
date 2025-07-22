
import { normalizeProduct, normalizeCategory } from './normalizers.js';
// =======================
// CONFIGURACIÓN GLOBAL
// =======================
const BACKEND_URL = "/api/products";
const PRODUCTS_PER_PAGE = 6;
let currentPage = 1;
let currentCategory = "";
let currentSearch = "";


// =======================
// FETCH DESDE BACKEND CON PAGINACIÓN
// =======================
async function fetchProductsFromBackend({ category = "", search = "", page = 1, limit = PRODUCTS_PER_PAGE } = {}) {
  try {
    const params = new URLSearchParams();
    if (category && category !== "all") params.append("category", category);
    if (search) params.append("search", search);

    const skip = (page - 1) * limit;
    params.append("skip", skip);
    params.append("limit", limit);

    const response = await fetch(`${BACKEND_URL}?${params.toString()}`);
    if (!response.ok) throw new Error("Error al obtener productos");

    const data = await response.json();
    return data.map(normalizeProduct);
  } catch (error) {
    console.error("Error al cargar productos:", error);
    return [];
  }
}

// =======================
// RENDERIZADO
// =======================
function getStockStatus(stock) {
  if (stock > 10) {
    return {
      text: "En stock",
      className: "en-stock",
    };
  }
  if (stock > 0) {
    return {
      text: "Últimas unidades",
      className: "pocas-unidades",
    };
  }
  return { text: "Agotado", className: "agotado" };
}

function createProductCard(product) {
  const card = document.createElement("li");
  card.classList.add("product-card");

  const priceContent = product.category.includes("gift-cards")
    ? ""
    : `$${product.price.toFixed(2)}`;

  const stockStatus = getStockStatus(product.stock);

  card.innerHTML = `
    <figure class="product-figure">
      <img src="${product.image || "/img/logo.webp"}" alt="${product.title}" loading="lazy">
      <figcaption class="caption">
        <h3 class="caption-title">${product.title}</h3>
        <div class="location">${product.brand}</div>
        <div class="price">${priceContent}</div>
        <p class="stock-status ${stockStatus.className}">${stockStatus.text}</p>
        <a href="/web/product-details.html?id=${product.id}" class="btn btn-outline-success btn-center">Ver más</a>
      </figcaption>
    </figure>
  `;
  return card;
}

function renderProducts(products, append = false) {
  const container = document.querySelector(".product-list");
  if (!container) return;

  if (!append) container.innerHTML = "";

  if (products.length === 0 && !append) {
    container.innerHTML = `<p>No se encontraron productos para tu búsqueda.</p>`;
    return;
  }

  products.forEach((product) => {
    container.appendChild(createProductCard(product));
  });
}

// =======================
// PAGINACIÓN DINÁMICA
// =======================
async function loadPage({ category = "", search = "" } = {}) {
  const products = await fetchProductsFromBackend({
    category,
    search,
    page: currentPage,
    limit: PRODUCTS_PER_PAGE,
  });

  renderProducts(products, currentPage > 1);

  const loadMoreBtn = document.querySelector(".load-more");
  if (loadMoreBtn) {
    loadMoreBtn.style.display = products.length < PRODUCTS_PER_PAGE ? "none" : "block";
  }
}

// =======================
// HELPERS
// =======================
function updateActiveCategoryLink(activeCategory) {
  // Si no hay categoría, el link "Todos los productos" debe ser el activo.
  const categoryToMatch = activeCategory || "all";
  document.querySelectorAll(".category-list a").forEach((link) => {
    link.classList.remove("active");
    if (link.dataset.category === categoryToMatch) {
      link.classList.add("active");
    }
  });
}
// =======================
// INICIALIZACIÓN PRINCIPAL
// =======================
async function initializeProductList() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search'); // Para futuras búsquedas
  const selectedCategory = urlParams.get('category');

  currentPage = 1;
  updateActiveCategoryLink(selectedCategory); // Marcar el link activo al cargar la página

  if (searchQuery) {
    currentSearch = searchQuery;
    // Opcional: actualizar el campo de búsqueda visualmente
    await loadPage({ search: currentSearch });
  } else if (selectedCategory) {
    currentCategory = selectedCategory === "all" ? "" : selectedCategory;
    await loadPage({ category: currentCategory });
  } else {
    await loadPage();
  }
}

// =======================
// EVENTOS DOM
// =======================
document.addEventListener("DOMContentLoaded", () => {

  document.querySelector(".load-more")?.addEventListener("click", async () => {
    currentPage++;
    await loadPage({ category: currentCategory, search: currentSearch });
  });

  document.querySelectorAll(".category-list a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const category = link.dataset.category;
      // Simplemente navegamos a la URL correcta. La página se recargará
      // y `initializeProductList` se encargará del resto.
      window.location.href = `/web/tienda.html?category=${category}`;
    });
  });

  initializeProductList();
});

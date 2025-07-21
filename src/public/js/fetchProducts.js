
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
function createProductCard(product) {
  const card = document.createElement("li");
  card.classList.add("product-card");

  const priceContent = product.category.includes("gift-cards")
    ? ""
    : `$${product.price.toFixed(2)}`;

  card.innerHTML = `
    <figure class="product-figure">
      <img src="${product.image || "/img/logo.webp"}" alt="${product.title}" loading="lazy">
      <figcaption class="caption">
        <h3 class="caption-title">${product.title}</h3>
        <div class="location">${product.brand}</div>
        <p class="description">${product.description}</p>
        <div class="price">${priceContent}</div>
        ${(() => {
  const statusClass =
    product.stock > 10
      ? "en-stock"
      : product.stock > 0
      ? "pocas-unidades"
      : "agotado";

  const statusText =
    product.stock > 10
      ? "En stock"
      : product.stock > 0
      ? "Últimas unidades"
      : "Agotado";

  return `<p class="stock-status ${statusClass}">${statusText}</p>`;
})()}
        <a href="product-details.html?id=${product.id}" class="btn btn-outline-success btn-center">Ver más</a>
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
// INICIALIZACIÓN PRINCIPAL
// =======================
async function initializeProductList() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search'); // Para futuras búsquedas
  const selectedCategory = urlParams.get('category');

  currentPage = 1;

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
  link.addEventListener("click", async (e) => {
    e.preventDefault();

    const selected = link.dataset.category;

    // Actualizar visualmente
    document.querySelectorAll(".category-list a").forEach((l) =>
      l.classList.remove("active")
    );
    link.classList.add("active");

    // Asignar categoría
    currentCategory = selected === "all" ? "" : selected;
    currentSearch = "";
    currentPage = 1;

    await loadPage({ category: currentCategory });
  });
});

  // Escuchar el evento personalizado de búsqueda desde el header
  document.addEventListener('performSearch', async (e) => {
    const query = e.detail.query;
    currentSearch = query;
    currentCategory = ""; // Resetear categoría al buscar
    currentPage = 1;
    await loadPage({ search: currentSearch });
  });

  initializeProductList();
});

//C:\Users\NuestraCompu\Desktop\CheBonita -Firestore\Chebonita-backend\src\public\js\loadHeaderFooter.js

import { toastSuccess, toastError } from './toast.js';
import { actualizarNumeroCarrito } from './cart.js';
document.addEventListener("DOMContentLoaded", () => {

  const loadHTML = async (url, placeholderId, callback) => {
    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`Error al cargar ${url}: ${response.status}`);
      const content = await response.text();
      document.getElementById(placeholderId).innerHTML = content;

 // Re-inicializar dropdowns Bootstrap una vez cargado el contenido
      const dropdownElements = document.querySelectorAll('.dropdown-toggle');
      dropdownElements.forEach(el => new bootstrap.Dropdown(el));

      // Ejecutar la función de callback si se proporciona
      if (typeof callback === "function") {
        callback();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Cargar header con callback para actualizar carrito y configurar búsqueda
  loadHTML("/web/header.html", "header-placeholder", () => {
    actualizarNumeroCarrito(); // Actualiza el carrito
    configurarToggleBusqueda(); // Configura el nuevo buscador
    configurarBuscador(); // Configura el buscador
    configurarFiltradoPorCategoria(); // Configura el filtrado por categoría
    verificarEstadoUsuario(); // Verifica el estado del usuario

    // Escuchar el evento personalizado 'cartUpdated' que se dispara desde cart.js
    // Esto asegura que el contador del carrito en el header se actualice en tiempo real.
    window.addEventListener('cartUpdated', () => {
      actualizarNumeroCarrito();
    });
  });

  // Cargar footer (sin callback en este caso)
  loadHTML("/web/footer.html", "footer-placeholder");
});

// Función para configurar el buscador
function configurarBuscador() {
  const searchForm = document.querySelector("#search-form");
  const searchInput = document.querySelector("#search-input");

  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault(); // Evitar recargar la página
      const query = searchInput.value.trim(); // Leer la consulta
      if (!query) return;

      // Siempre redirigir a la página de la tienda con el parámetro de búsqueda en la URL.
      // Esto unifica el comportamiento y hace que las búsquedas sean compartibles.
      const currentPath = window.location.pathname;
      // Obtenemos la ruta base para construir la URL correctamente desde cualquier página.
      const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
      const targetUrl = `${basePath}tienda.html?search=${encodeURIComponent(query)}`;
      window.location.href = targetUrl;
    });
  } else {
    console.error("No se encontró el formulario o el input de búsqueda.");
  }
}

function configurarToggleBusqueda() {
  const toggleBtn = document.getElementById('search-toggle-btn');
  const searchOverlay = document.getElementById('search-overlay');
  const searchInput = document.getElementById('search-input');

  toggleBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation(); // Evita que el clic se propague al documento
    searchOverlay.classList.toggle('active');
    // Al abrir el buscador, poner el foco en el campo de texto
    if (searchOverlay.classList.contains('active')) {
      searchInput.focus();
    }
  });

  // Mejorar UX: cerrar el buscador si se hace clic fuera de él
  document.addEventListener('click', (e) => {
    // Si el overlay está activo y el clic no fue en el overlay ni en el botón que lo abre...
    if (searchOverlay.classList.contains('active') && !searchOverlay.contains(e.target) && e.target !== toggleBtn) {
      // ...entonces lo cerramos.
      searchOverlay.classList.remove('active');
    }
  });
}

function configurarFiltradoPorCategoria() {
  document.querySelectorAll(".category-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const selectedCategory = link.dataset.category;
      if (!selectedCategory) return;

      // Construir la URL con el parámetro de categoría
      const currentPath = window.location.pathname;
      const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
      const targetUrl = `${basePath}tienda.html?category=${selectedCategory}`;
      window.location.href = targetUrl;
    });
  });
}
async function verificarEstadoUsuario() {
  try {
    const res = await fetch('/api/users/me', {
      credentials: 'include'
    });

    const user = await res.json();
    if (!res.ok) throw new Error();

    const displayName = user.name?.split(' ')[0] || user.email;

    const dropdownHTML = `
      <div class="dropdown">
        <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button"
          id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="bi bi-person me-1"></i> ${displayName}
        </a>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
          <li><a class="dropdown-item" href="/profile/index.html">Mi perfil</a></li>          
          <li><a class="dropdown-item logout-link" href="#">Cerrar sesión</a></li>
        </ul>
      </div>
    `;

    document.getElementById('userLinks').innerHTML = dropdownHTML;

    // Logout listener
    document.querySelectorAll('.logout-link').forEach(link => {
      link.addEventListener('click', cerrarSesion);
    });
  } catch (err) {
    // No logueado
    const loginHTML = `<a class="nav-link" href="/auth/login.html">Log in</a>`;
    const mobileHTML = `<a class="nav-link" href="/auth/login.html"><i class="bi bi-person"></i></a>`;

    document.getElementById('userLinks').innerHTML = loginHTML;
  }
}
async function cerrarSesion(e) {
  e.preventDefault();
  try {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    if (!res.ok) throw new Error();

    toastSuccess('Sesión cerrada correctamente');
    // Redirigir siempre a la página de login para un comportamiento consistente.
    setTimeout(() => window.location.replace('/auth/login.html'), 1500);
  } catch (err) {
    toastError('Error al cerrar sesión', 'error');
  }
}

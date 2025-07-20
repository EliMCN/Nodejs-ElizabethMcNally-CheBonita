// dashboardLoadHeaderFooter.js
import { toastSuccess, toastError } from './toast.js';

document.addEventListener('DOMContentLoaded', () => {
 loadDashboardHeader();
  loadHTML('/dashboard/shared/footer.dashboard.html', 'footer-container');
});

async function loadHTML(url, containerId) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error al cargar ${url}`);
    const html = await res.text();
    document.getElementById(containerId).innerHTML = html;    
  } catch (err) {
    console.error(err);
  }
}

function setupLogout() {
  document.querySelectorAll('.logout-link').forEach(link => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        const res = await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include'
        });
        if (!res.ok) throw new Error();

        toastSuccess('Sesión cerrada correctamente');
        setTimeout(() => window.location.replace('/auth/login.html'), 1500);
      } catch (err) {
        toastError('Error al cerrar sesión');
      }
    });
  });
}

async function loadDashboardHeader() {
  try {
    const res = await fetch('/api/users/me', { credentials: 'include' });
    if (!res.ok) {
      // Si la sesión no es válida, redirigir. 
      if (res.status === 401 || res.status === 403) {
        toastError('Sesión expirada o inválida. Redirigiendo...');
        // Usamos replace para que el usuario no pueda volver atrás en el historial
        setTimeout(() => window.location.replace('/auth/login.html'), 2000);
      }
      throw new Error('No autorizado'); // Detiene la ejecución del resto del script
    }

    const user = await res.json();
    const { role } = user;

    let links = '';

    if (role === 'admin') {
      links = `
         <a href="/dashboard/admin/index.html">Dashboard</a>
        <a href="/dashboard/profile/index.html">Mi Perfil</a>
        <a href="/dashboard/admin/products.html">Productos</a>
        <a href="/dashboard/admin/users.html">Usuarios</a>
        <a href="/dashboard/admin/orders.html">Órdenes</a>
      `;
    } else if (role === 'cliente') {
      links = `
        <a href="/dashboard/profile/index.html">Mi Perfil</a>
        <a href="/dashboard/profile/my-orders.html">Mis Compras</a>
      `;
    }

    document.getElementById('dashboard-header').innerHTML = `
      <header class="dashboard-main-header">
        <div class="dashboard-logo">
          <a href="/index.html"><img src="/img/logo.webp" alt="Che Bonita" style="height: 40px;"></a>
        </div>
        <nav class="dashboard-nav">
          ${links}
          <a href="#" class="logout-link">Cerrar Sesión</a>
        </nav>
      </header>
    `;

    setupLogout();
  } catch (err) {    
    if (err.message !== 'No autorizado') {
      console.error('No se pudo cargar el header:', err);
    }
  }
}

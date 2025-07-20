// adminDashboard.js
import { toastError, toastWarning } from './toast.js';

async function fetchDashboardData() {
  try {
    const res = await fetch('/api/admin/dashboard/summary', { credentials: 'include' });
    if (!res.ok) throw new Error(`Error al cargar el resumen: ${res.status}`);

    const data = await res.json();
    populateDashboard(data);

  } catch (err) {
    console.error(err);
    toastError(`No se pudo cargar los datos del dashboard`);
  }
}

function populateDashboard(data) {
  // Ventas Totales
  document.getElementById('totalSales').innerText = `$${(data.totalSales || 0).toFixed(2)}`;

  // Usuarios Registrados
  document.getElementById('totalUsers').innerText = data.totalUsers || 0;

  // Productos con stock bajo
  const lowStockList = document.getElementById('lowStockList');
  lowStockList.innerHTML = ''; // Limpiar lista anterior
  if (data.lowStockProducts && data.lowStockProducts.length > 0) {
    data.lowStockProducts.forEach(p => {
      const li = document.createElement('li');
      li.textContent = `${p.name} - Stock: ${p.stock}`;
      lowStockList.appendChild(li);
    });
    toastWarning(`Hay ${data.lowStockProducts.length} producto(s) con stock bajo.`);
  } else {
    const li = document.createElement('li');
    li.textContent = 'Todos los productos tienen stock suficiente.';
    lowStockList.appendChild(li);
  }

  // Gráfica de ventas por categoría
  if (data.salesByCategory && Object.keys(data.salesByCategory).length > 0) {
    new Chart(document.getElementById('salesChart'), {
      type: 'bar',
      data: {
        labels: Object.keys(data.salesByCategory),
        datasets: [{
          label: 'Productos por Categoría',
          data: Object.values(data.salesByCategory),
          backgroundColor: '#4CAF50'
        }]
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchDashboardData();
});

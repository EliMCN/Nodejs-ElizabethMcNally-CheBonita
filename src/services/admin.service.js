import { db } from '../config/firebase.config.js';

/**
 * Obtiene un resumen de datos para el dashboard de admin.
 * Centraliza la lógica de acceso a datos.
 */
export const getDashboardSummary = async () => {
  // Usamos Promise.allSettled para que si una promesa falla, las demás continúen.
  const usersPromise = db.collection('users').get();
  const productsPromise = db.collection('products').get();
  const ordersPromise = db.collection('orders').get();

  const results = await Promise.allSettled([
    usersPromise,
    productsPromise,
    ordersPromise,
  ]);

  const [usersResult, productsResult, ordersResult] = results;

  // Procesar usuarios
  const totalUsers = usersResult.status === 'fulfilled' ? usersResult.value.size : 0;

  // Procesar productos
  const lowStockProducts = [];
  const salesByCategory = {};
  if (productsResult.status === 'fulfilled') {
    productsResult.value.forEach(doc => {
      const product = doc.data();
      if (product.stock < 10) {
        lowStockProducts.push({ name: product.title, stock: product.stock });
      }
      const category = Array.isArray(product.category) ? product.category[0] : product.category;
      if (category) {
        salesByCategory[category] = (salesByCategory[category] || 0) + 1;
      }
    });
  }

  // Procesar órdenes
  let totalSales = 0;
  if (ordersResult.status === 'fulfilled') {
    ordersResult.value.forEach(doc => {
      totalSales += doc.data().total || 0;
    });
  }

  return {
    totalSales,
    totalUsers,
    lowStockProducts,
    salesByCategory,
  };
};
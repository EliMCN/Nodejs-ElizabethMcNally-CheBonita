import { db } from '../config/firebase.config.js';
import { updateUser } from '../services/user.service.js';

/**
 * Obtiene todos los usuarios de la base de datos.
 * Excluye el hash de la contraseña por seguridad.
 */
export const getAllUsers = async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const users = usersSnapshot.docs.map(doc => {
      const data = doc.data();
      delete data.passwordHash; // Nunca enviar la contraseña al cliente
      return { id: doc.id, ...data };
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Desactiva un usuario en lugar de borrarlo (soft delete). 
 */
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const loggedInUserId = req.user.id; // ID del admin que hace la petición

  if (id === loggedInUserId) {
    return res.status(400).json({ error: 'Un administrador no puede desactivarse a sí mismo.' });
  }

  try {
    const userRef = db.collection('users').doc(id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await userRef.update({ active: false });

    res.status(200).json({ message: 'Usuario desactivado correctamente' });
  } catch (error) {
    console.error(`Error al desactivar usuario ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Actualiza los datos de un usuario desde el panel de admin.
 */
export const updateUserByAdmin = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, active } = req.body;
  const loggedInUserId = req.user.id;

  // Previene que un admin se quite el rol de admin o se desactive a sí mismo
  if (id === loggedInUserId && (role !== 'admin' || active === false)) {
    return res.status(403).json({ error: 'Un administrador no puede cambiar su propio rol o desactivarse.' });
  }

  try {
    const dataToUpdate = { name, email, role, active };
    await updateUser(id, dataToUpdate); // Reutiliza el servicio de actualización de usuario
    res.status(200).json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error(`Error al actualizar usuario ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Obtiene un resumen de datos para el dashboard de admin.
 */
export const getDashboardSummary = async (req, res) => {
  try {
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

    res.status(200).json({
      totalSales,
      totalUsers,
      lowStockProducts,
      salesByCategory,
    });
  } catch (error) {
    console.error('Error al obtener el resumen del dashboard:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

import { updateUser, getAllUsersService, deleteUser as deleteUserService } from '../services/user.service.js';
import { getDashboardSummary as getDashboardSummaryService } from '../services/admin.service.js';



/**
 * Obtiene todos los usuarios de la base de datos.
 * Excluye el hash de la contraseña por seguridad.
 */
export const getAllUsers = async (req, res) => {
  try {
   // Usar el servicio centralizado para obtener los usuarios, que ya excluye datos sensibles.
    const users = await getAllUsersService();
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
    return res.status(403).json({ error: 'Un administrador no puede desactivarse a sí mismo.' });
  }

  try {
   // Usar el servicio centralizado para desactivar el usuario
    const success = await deleteUserService(id);
    if (!success) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

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
 // Obtenemos los campos permitidos del body. NO incluimos 'role' para evitar modificaciones.
  const { name, email, active, address } = req.body;
  const loggedInUserId = req.user.id;

  // Previene que un admin se desactive a sí mismo. La edición de rol ya está bloqueada.
  if (id === loggedInUserId && active === false) {
    return res.status(403).json({ error: 'Un administrador no puede desactivarse a sí mismo.' });
 }

  try {
    // Construir el objeto de actualización dinámicamente
    // para evitar sobrescribir campos con 'undefined' si no vienen en la petición.
    const dataToUpdate = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (email !== undefined) dataToUpdate.email = email;
    if (active !== undefined) dataToUpdate.active = active;
    if (address !== undefined) dataToUpdate.address = address;
    // El campo 'role' se omite intencionadamente para mayor seguridad.

    // Si no se envió ningún dato para actualizar, no hacemos nada.
    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron datos para actualizar.' });
    }
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
    // La lógica de negocio se mueve a un servicio para mantener el controlador limpio.
    const summary = await getDashboardSummaryService();
    res.status(200).json(summary);
  } catch (error) {
    console.error('Error al obtener el resumen del dashboard:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

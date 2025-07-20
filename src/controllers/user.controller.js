//  controllers/user.controller.js (modo JSON local)
import bcrypt from 'bcryptjs';
import { getUserById,  updateUser } from '../services/user.service.js';

export const getProfile = async (req, res) => {
  const { uid } = req.user;
  try {
    const user = await getUserById(uid);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const { passwordHash, resetToken, resetTokenExpiry, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo perfil' });
  }
};

export const updateProfile = async (req, res) => {
  const { uid } = req.user;
  const { name, address } = req.body;

  if (!name) return res.status(400).json({ error: 'El nombre es obligatorio' });

  try {
    const user = await getUserById(uid);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const updated = {           
    name: name || user.name,       
    address: address && address.street ? address : user.address
    };
    await updateUser(uid, updated);
    return res.json({ message: 'Perfil actualizado correctamente' });    
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    return res.status(500).json({ error: 'No se pudo actualizar el perfil' });
  }
};
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { uid } = req.user;

    const user = await getUserById(uid);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'La contraseña actual es incorrecta' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await updateUser(uid, { passwordHash: user.passwordHash });

    return res.status(200).json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const deleteAccount = async (req, res) => {
  const { uid } = req.user;

  try {
    const user = await getUserById(uid);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    if (user.role === 'admin') {
      return res.status(403).json({ error: 'La cuenta del administrador no puede eliminarse' });
    }

    await updateUser(uid, { active: false });
    res.clearCookie('token');
    return res.status(200).json({ message: 'Cuenta eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la cuenta:', error);
    return res.status(500).json({ error: 'No se pudo eliminar la cuenta' });
  }
};
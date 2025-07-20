// routes/user.routes.js
import express from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} from '../controllers/user.controller.js';

const router = express.Router();

// Rutas protegidas
router.get('/me', getProfile);           // Obtener perfil del usuario autenticado
router.put('/profile', updateProfile);   // Actualizar datos básicos del perfil
router.post('/change-password', changePassword); // Cambiar contraseña
router.delete('/me', deleteAccount);      // Eliminar cuenta

export default router;
// routes/auth.routes.js
import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
// Recuperación de contraseña
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

export default router;
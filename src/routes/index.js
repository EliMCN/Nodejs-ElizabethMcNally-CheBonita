import { Router } from 'express';
import { requireAuth, checkRole } from '../middlewares/auth.middleware.js';

// Importar todos los enrutadores
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';
import productRoutesPublic from './product.public.routes.js';
import userRoutes from './user.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import viewRoutes from './views.routes.js';

const router = Router();

// Rutas de API
router.use('/api/auth', authRoutes); // Públicas y de usuario
router.use('/api/products', productRoutesPublic); // Públicas
router.use('/api/users', requireAuth, userRoutes); // De usuario autenticado

router.use('/api/admin', requireAuth, checkRole(['admin']), adminRoutes); // Rutas solo para Admin

// Rutas de Vistas y Dashboards
router.use('/', dashboardRoutes);
router.use('/', viewRoutes);

export default router;
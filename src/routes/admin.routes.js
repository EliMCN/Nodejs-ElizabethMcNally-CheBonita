// routes/admin.routes.js
import express from 'express';
import * as adminController from '../controllers/admin.controller.js';
import productAdminRoutes from './product.admin.routes.js';

const router = express.Router();

// Rutas de productos para Admin/Vendedor
router.use('/products', productAdminRoutes);

// Solo accesibles por admins
router.get('/users', adminController.getAllUsers);
router.put('/users/:id', adminController.updateUserByAdmin);
router.delete('/users/:id', adminController.deleteUser);
router.get('/dashboard/summary', adminController.getDashboardSummary);

export default router;

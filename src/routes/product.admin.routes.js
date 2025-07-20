// routes/product.admin.routes.js

import { Router } from 'express';
import {
  createProduct,
  updateProductPartial,
  deleteProduct,
  updateProduct,
} from '../controllers/product.controller.js';


import {
  validateProductCreate,
  validateProductUpdatePartial,
  validateProductUpdateFull,
} from '../middlewares/productValidator.js';

import { handleValidationErrors } from '../middlewares/handleValidationErrors.js';

const router = Router();

// Rutas de administración de productos (CUD - Create, Update, Delete). El Admin ve los GEt dede las rutaS PUBLICAS
router.post(
  '/',
  validateProductCreate,
  handleValidationErrors,
  createProduct
);

router.patch(
  '/:id',
  validateProductUpdatePartial,
  handleValidationErrors,
  updateProductPartial
);

router.put(
  '/:id',
  validateProductUpdateFull,
  handleValidationErrors,
  updateProduct
);

router.delete(
  '/:id',
  deleteProduct
);

export default router;

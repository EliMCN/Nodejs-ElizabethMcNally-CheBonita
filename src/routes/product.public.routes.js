import { Router } from 'express';
import {
  getAllProducts,
  getProductById,  
} from '../controllers/product.controller.js';


const router = Router();

// routes/product.routes.public.js (GET sin login)
router.get('/', getAllProducts);
router.get('/:id', getProductById);



export default router;

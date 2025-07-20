import { Router } from 'express';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { requireAuth, checkRole } from '../middlewares/auth.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename)); // Sube un nivel para estar en /src

const router = Router();

router.use('/admin', requireAuth, checkRole(['admin']), express.static(path.join(__dirname, 'public/dashboard/admin')));
router.use('/client', requireAuth, checkRole(['cliente']), express.static(path.join(__dirname, 'public/dashboard/client')));
router.use('/profile', requireAuth, checkRole(['cliente', 'admin']), express.static(path.join(__dirname, 'public/dashboard/profile')));

export default router;

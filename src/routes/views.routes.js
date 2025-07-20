import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename)); // Sube un nivel para estar en /src

const router = Router();

//  Página principal
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

router.get('/auth/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/auth/login.html'));
});

router.get('/auth/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/auth/register.html'));
});

router.get('/auth/forgot-password.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/auth/forgot-password.html'));
});

router.get('/auth/reset-password.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/auth/reset-password.html'));
});

export default router;
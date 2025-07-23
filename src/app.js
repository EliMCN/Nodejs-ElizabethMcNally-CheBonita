//src\app.js

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';

import mainRouter from './routes/index.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//  Content Security Policy personalizada 
app.use((req, res, next) => {
 res.setHeader(
  'Content-Security-Policy',
  "default-src 'self'; " +
  "script-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; " +
  "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; " +
  "img-src 'self' data: https://res.cloudinary.com; " +
  "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net; " +
  "connect-src 'self';"
);
  next();
});

//  Seguridad, logs y parseo
app.use(helmet({
  contentSecurityPolicy: false //  para que no sobrescriba la CSP custom
}));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de CORS dinámica para aceptar peticiones de localhost y Vercel
const allowedOrigins = ['http://localhost:4000'];
if (process.env.VERCEL_URL) {
  allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
// Archivos estáticos
// 1. Primero, intenta servir archivos desde 'public/web'.
//    Esto permite que una petición a /tienda.html se resuelva a public/web/tienda.html.
app.use(express.static(path.join(__dirname, 'public/web')));
// 2. Si no se encuentra, intenta servir archivos desde la raíz de 'public'.
//    Esto sirve /favicon.ico, /index.html, y los directorios /js, /styles, etc.
app.use(express.static(path.join(__dirname, 'public')));

// Usar el enrutador principal para todas las rutas
app.use('/', mainRouter);

export default app;

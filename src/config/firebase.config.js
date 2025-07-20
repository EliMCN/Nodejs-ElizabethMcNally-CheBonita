// config/firebase.config.js
import admin from 'firebase-admin';
import dotenv from 'dotenv';

// Cargar variables desde .env
dotenv.config();

let serviceAccount;

if (process.env.FIREBASE_CONFIG_JSON) {
  // Entorno de producción (Vercel): la variable de entorno contiene el JSON como un string.
  serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG_JSON);
} else {
  // Entorno local: leemos el archivo de credenciales directamente.
  // Esto requiere un import dinámico porque 'fs' no debe cargarse en el navegador o en Vercel si no se usa.
  const { readFileSync } = await import('fs');
  const { fileURLToPath } = await import('url');
  const path = (await import('path')).default;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const serviceAccountPath = path.resolve(__dirname, 'serviceAccountKey.json');
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();
export { admin };
export const auth = admin.auth();

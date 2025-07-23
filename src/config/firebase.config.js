// config/firebase.config.js
import dotenv from 'dotenv';
dotenv.config();

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';



let serviceAccount;

// En Vercel (producción), usamos una única variable Base64 para evitar problemas de formato.
if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
  try {
    const serviceAccountJson = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf-8');
    serviceAccount = JSON.parse(serviceAccountJson);
  } catch (error) {
    console.error("Error al decodificar la variable de entorno de Firebase Base64:", error);
    throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 no es un JSON válido en Base64.');
  }
} else {
  // En local, leemos el archivo directamente para mayor comodidad.
  try {
    const { readFileSync } = await import('fs');
    const { fileURLToPath } = await import('url');
    const path = (await import('path')).default;

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const serviceAccountPath = path.resolve(__dirname, 'serviceAccountKey.json');
    serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));
  } catch (error) {
    console.error("No se encontró el archivo serviceAccountKey.json para desarrollo local.");
    throw new Error('Falta la configuración de Firebase. Define FIREBASE_SERVICE_ACCOUNT_BASE64 en producción o asegúrate de que serviceAccountKey.json exista en src/config/ para desarrollo local.');
  }
}

// Prevent reinitializing Firebase multiple times
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore();
export { db };

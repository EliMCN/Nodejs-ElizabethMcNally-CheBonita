//parascripts backend

// config/firebase.config.js
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();
export { admin };
export const auth = admin.auth();

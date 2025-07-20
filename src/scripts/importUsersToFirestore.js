// scripts/importUsersToFirestore.js
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { db, admin } from '../config/firebase.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../data/users_firestore_ready.json');

const run = async () => {
  try {
    const raw = await readFile(filePath, 'utf-8');
    const users = JSON.parse(raw);

    for (const { documentId, fields } of users) {
      
      const dataToSet = {
        ...fields,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      await db.collection('users').doc(documentId).set(dataToSet);
      console.log(` Usuario cargado: ${fields.email}`);
    }

    console.log(' Todos los usuarios fueron importados.');
    process.exit(0);
  } catch (err) {
    console.error(' Error al importar usuarios:', err);
    process.exit(1);
  }
};

run();

//node src/scripts/importUsersToFirestore.js
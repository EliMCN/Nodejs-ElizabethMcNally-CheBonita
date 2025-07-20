import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/firebase.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, '../data/products.json'); 

const importProductsToFirestore = async () => {
  try {
    const data = await readFile(jsonPath, 'utf-8');
    const parsed = JSON.parse(data);
    const products = parsed.products;

    for (const product of products) {
      const docId = uuidv4(); // Generar un ID único para el documento
      const productToUpload = {
        ...product,
        id: docId, // Guardar el mismo ID también como un campo interno para consistencia
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const docRef = db.collection('products').doc(docId);
      await docRef.set(productToUpload);
      console.log(`Producto ${product.title} importado`);
    }

    console.log(' Importación completa');
  } catch (err) {
    console.error(' Error al importar productos:', err.message);
  }
};
// Ejecutar solo si se llama directamente
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  importProductsToFirestore();
}



//node src/scripts/importProductsToFirestore.js
import { db } from '../config/firebase.config.js';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../models/Product.model.js';

// Buscar con filtros
export async function getFilteredProductsFromFirestore({ category, search, limit, skip }) {
  let ref = db.collection('products');
  let snapshot = await ref.get();

  let allProducts = [];
  snapshot.forEach(doc => {
    allProducts.push({ id: doc.id, ...doc.data() });
  });

  if (category && category.toLowerCase() !== 'all') {
    const normalized = category.toLowerCase().trim();
    allProducts = allProducts.filter(p => (p.category || '').toLowerCase() === normalized);
  }

  if (search) {
    const keyword = search.toLowerCase();
    allProducts = allProducts.filter(p =>
      (p.title || '').toLowerCase().includes(keyword) ||
      (p.description || '').toLowerCase().includes(keyword) ||
      (p.brand || '').toLowerCase().includes(keyword) ||
      (p.category || '').toLowerCase().includes(keyword)
    );
  }

  const start = parseInt(skip) || 0;
  const end = limit ? start + parseInt(limit) : undefined;
  return allProducts.slice(start, end);
}

// Buscar por ID
export async function getProductByIdFromFirestore(id) {
  const doc = await db.collection('products').doc(String(id)).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

// Crear producto con validación
export async function createProductInFirestore(newProductData) {
  const snapshot = await db.collection('products')
    .where('title', '==', newProductData.title)
    .get();

  if (!snapshot.empty) throw new Error('Ya existe un producto con ese título');

  // Creamos una instancia de la clase Product
  const productInstance = new Product({
    ...newProductData,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Uso del modelo Product
  productInstance.isValid();

  const ref = db.collection('products').doc(productInstance.id);
  await ref.set({ ...productInstance });
  return productInstance;
}

// PATCH parcial (sin validación completa, se asume validación por express-validator)
export async function updateProductPartialInFirestore(id, updates) {
  const ref = db.collection('products').doc(String(id));
  const doc = await ref.get();
  if (!doc.exists) return null;

  await ref.update(updates);
  const updated = await ref.get();
  return { id: updated.id, ...updated.data() };
}

// PUT completo con validación
export async function updateProductInFirestore(id, updatedData) {
  const ref = db.collection('products').doc(String(id));
  const doc = await ref.get();
  if (!doc.exists) return null;

  await ref.set(updatedData);
  const updated = await ref.get();
  return { id: updated.id, ...updated.data() };
}

// Eliminar
export async function deleteProductFromFirestore(id) {
  const ref = db.collection('products').doc(String(id));
  const doc = await ref.get();
  if (!doc.exists) return null;

  await ref.delete();
  return { id, ...doc.data() };
}

//Chebonita-backend\services\product.service.js

// Fuente Firestore
import {
  getFilteredProductsFromFirestore,
  getProductByIdFromFirestore,
  createProductInFirestore,
  updateProductPartialInFirestore,
  updateProductInFirestore,
  deleteProductFromFirestore
} from './product.sources.firestore.js';

// === Listar productos con filtros (GET /products)
export const getFilteredProductsService = async (params) => {
  return getFilteredProductsFromFirestore(params);
};

// === Obtener producto por ID
export const getProductByIdService = async (id) => {
  return getProductByIdFromFirestore(id);
};

// === Crear nuevo producto
export const createProductService = async (product) => {
  return createProductInFirestore(product);
};

// === Actualización parcial (PATCH)
export const updateProductPartialService = async (id, updates) => {
  return updateProductPartialInFirestore(id, updates);
};

// === Actualización total (PUT)
export const updateProductService = async (id, data) => {
  return updateProductInFirestore(id, data);
};

// === Eliminar producto (DELETE)
export const deleteProductService = async (id) => {
  return deleteProductFromFirestore(id);
};

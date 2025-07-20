// =======================
// CATEGORÍAS 
// =======================
const category = [
  "carteras",
  "zapatos",
  "relojes",
  "vestidos",
  "joyería",
  "ediciones-especiales",
  "básicos",
  "gift-cards",
];

// =======================
// NORMALIZADORES
// =======================
export function normalizeCategory(category) {
  return Array.isArray(category) ? category : [category || "Sin categoría"];
}

export function normalizeProduct(product) {
  return {
    id: product.id|| product._id || product.doc_id,
    title: product.title || product.name || "Producto sin título",
    description: product.description || "Sin descripción disponible",
    category: normalizeCategory(product.category),
    price: product.price || 0,
    discountPercentage: product.discountPercentage || 0,
    rating: product.rating || 0,
    stock: product.stock || 0,
    image: product.image || product.images?.[0] || null,
    images: (product.images && product.images.length > 0) ? product.images : (product.image ? [product.image] : []),
    brand: product.brand || "Sin marca",
  };
}
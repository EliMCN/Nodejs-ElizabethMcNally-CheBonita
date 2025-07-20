// utils/validateProduct.js
export function validateProductObject(product) {
  const errors = [];

  if (!product.id || typeof product.id !== 'number') {
    errors.push("Invalid or missing 'id'");
  }

  if (!product.title || typeof product.title !== 'string') {
    errors.push("Missing or invalid 'title'");
  }

  if (typeof product.price !== 'number' || product.price < 0) {
    errors.push("Invalid 'price'");
  }

  if (!product.category || typeof product.category !== 'string') {
    errors.push("Missing or invalid 'category'");
  }

  if (!product.description || typeof product.description !== 'string') {
    errors.push("Missing or invalid 'description'");
  }

  if (product.image && typeof product.image !== 'string') {
    errors.push("Invalid 'image'");
  }

  if (product.images && !Array.isArray(product.images)) {
    errors.push("Invalid 'images' (must be array)");
  }

  if (product.stock !== undefined && typeof product.stock !== 'number') {
    errors.push("Invalid 'stock'");
  }

  return errors;
}

/**
 * @class Product
 * Representa la estructura y las reglas de negocio de un producto en la aplicación.
 * Aunque Firestore es schema-less, esta clase nos da un "contrato" claro de cómo
 * debe ser un objeto de producto, centralizando su estructura y validación.
 */
export class Product {
  /**
   * Crea una instancia de Producto.
   * @param {object} data - Los datos brutos del producto.
   */
  constructor({
    id,
    title,
    description,
    price,
    stock,
    category,
    brand = '',
    image = '',
    images = [],
    discountPercentage = 0,
    rating = 0,
    specialEdition = false,
    isGiftCard = false,
  }) {
    this.id = id; // Será generado por el servicio si es un producto nuevo.
    this.title = title;
    this.description = description;
    this.price = Number(price) || 0;
    this.stock = Number(stock) || 0;
    this.category = Array.isArray(category) ? category : [category];
    this.brand = brand;
    this.image = image;
    this.images = images;
    this.discountPercentage = Number(discountPercentage) || 0;
    this.rating = Number(rating) || 0;
    this.specialEdition = specialEdition;
    this.isGiftCard = isGiftCard;
  }

  /**
   * Valida los campos esenciales del producto.
   * @returns {boolean} - True si el producto es válido, de lo contrario lanza un error.
   */
  isValid() {
    if (!this.title || this.price < 0 || this.stock < 0 || !this.category) {
      throw new Error('Los campos título, precio, stock y categoría son obligatorios y deben ser válidos.');
    }
    return true;
  }
}
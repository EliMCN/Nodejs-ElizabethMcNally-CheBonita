// Chebonita-backend\controllers\product.controller.js

import {
  getFilteredProductsService,
  getProductByIdService,
  createProductService,
  updateProductPartialService,
  updateProductService,
  deleteProductService
} from '../services/product.service.js';

export async function getAllProducts(req, res, next) {
  try {
    const { category, search, limit, skip } = req.query;
    const products = await getFilteredProductsService({ category, search, limit, skip });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
}

export async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    const product = await getProductByIdService(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
}

export async function updateProductPartial(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await updateProductPartialService(id, updates);
    if (!updated) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req, res, next) {
  try {
    // Definir el producto con todos los campos y valores por defecto
    const productData = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
      brand: req.body.brand || '',
      image: req.body.image || '',
      images: req.body.images || [],
      discountPercentage: req.body.discountPercentage || 0,
      rating: req.body.rating || 0,
      specialEdition: req.body.specialEdition || false,
      isGiftCard: req.body.isGiftCard || false,
      customizable: req.body.customizable || false,
    };
    const created = await createProductService(productData);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await deleteProductService(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json({
      message: 'Producto eliminado correctamente',
      product: deleted
    });
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updated = await updateProductService(id, updatedData);
    if (!updated) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
}

import { body } from 'express-validator';

export const validateProductFields = [
  body('title')
    .trim().notEmpty().withMessage('Title is required')
    .isString().withMessage('Title must be a string'),

  body('description')
    .trim().notEmpty().withMessage('Description is required')
    .isString().withMessage('Description must be a string'),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ gt: 0 }).withMessage('Price must be a number greater than 0'),

  body('category')
    .trim().notEmpty().withMessage('Category is required')
    .isString().withMessage('Category must be a string'),

  body('brand').optional().isString(),
  body('image').optional().isString(),
  body('images').optional().isArray(),
  body('stock').optional().isInt({ min: 0 }),
  body('discountPercentage').optional().isFloat({ min: 0, max: 100 }),
  body('rating').optional().isFloat({ min: 0, max: 5 }),
  body('specialEdition').optional().isBoolean(),
  body('isGiftCard').optional().isBoolean(),
  body('customizable').optional().isBoolean(),
  body('customizableValues').optional().isArray()
];

// POST (usa todo obligatorio)
export const validateProductCreate = validateProductFields;

// PUT (igual que POST, reemplazo total)
export const validateProductUpdateFull = validateProductFields;

// PATCH (versión más flexible, todos opcionales)
export const validateProductUpdatePartial = [
  body('title').optional().isString(),
  body('description').optional().isString(),
  body('price').optional().isFloat({ gt: 0 }),
  body('category').optional().isString(),
  body('brand').optional().isString(),
  body('image').optional().isString(),
  body('images').optional().isArray(),
  body('stock').optional().isInt({ min: 0 }),
  body('discountPercentage').optional().isFloat({ min: 0, max: 100 }),
  body('rating').optional().isFloat({ min: 0, max: 5 }),
  body('specialEdition').optional().isBoolean(),
  body('isGiftCard').optional().isBoolean(),
  body('customizable').optional().isBoolean(),
  body('customizableValues').optional().isArray()
];

// services/jwt.service.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = '2h';

/**
 * Genera un token JWT con un payload dado
 * @param {Object} payload - Información del usuario (ej: { uid, role })
 * @param {Object} [options] - Opciones opcionales como expiresIn
 * @returns {string} JWT token
 */
export function generateToken(payload, options = {}) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN, ...options });
}

/**
 * Verifica y decodifica un token JWT
 * @param {string} token
 * @returns {Object} payload decodificado
 * @throws Error si el token es inválido o expiró
 */


console.log(' JWT_SECRET:', JWT_SECRET);
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

//  middlewares/auth.middleware.js (modo local con JWT)
import { verifyToken } from '../services/jwt.service.js';

const JWT_SECRET = process.env.JWT_SECRET ;

export const requireAuth = (req, res, next) => {
  const token = req.cookies.token;
if (!token) {
  return res.status(401).json({ error: 'Token no provisto' });
}

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // { uid, role }
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalido o expirado' });
  }
};

export const checkRole = (allowedRoles = []) => {
  return (req, res, next) => {
    const { role } = req.user;
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ error: 'Acceso denegado: role insuficiente' });
    }
    next();
  };
};

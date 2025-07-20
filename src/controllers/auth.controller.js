// controllers/auth.controller.js (modo local con JSON + JWT)
import bcrypt from 'bcryptjs';
import { generateToken } from '../services/jwt.service.js';
import crypto from 'crypto';
import { sendResetPasswordEmail } from '../services/email.service.js';
import {
  createUser,
  findUserByEmail, 
  updateUser,
  findUserBy
} from '../services/user.service.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto123';

// auth.controller.js
export const register = async (req, res) => {
  const { name, email, password, role = 'cliente', address } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }

  try {
    const user = await createUser({ name, email, password, role, address });

    return res.status(201).json({
      message: 'Usuario registrado',
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    return res.status(500).json({ error: error.message || 'Error interno del servidor' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = generateToken({ uid: user.id, role: user.role });

    //  Setear cookie con el token
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 2
    });

    return res.status(200).json({
      user: { id: user.id, email: user.email, role: user.role, name: user.name }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      // Por seguridad, no revelamos si el usuario existe.
      return res.status(200).json({ message: 'Si el correo existe, se enviará un enlace de recuperación.' });
    }

    // 1. Generar token para el usuario (el que va en el email)
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 2. Hashear el token antes de guardarlo en la BD (más seguro)
    const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const passwordResetExpires = Date.now() + 3600000; // 1 hora de validez

    await updateUser(user.id, {
      resetToken: passwordResetToken,
      resetTokenExpiry: passwordResetExpires
    });

    // 3. Construir la URL de reseteo usando la variable de entorno y la ruta correcta
    const resetURL = `${process.env.FRONTEND_URL}/auth/reset-password.html?token=${resetToken}`;

    // 4. Enviar el correo con la URL completa
    const previewUrl = await sendResetPasswordEmail(user.email, resetURL);

    const responsePayload = { message: 'Se ha enviado un enlace de recuperación a tu correo.' };
    // Solo en desarrollo, devolvemos la URL de vista previa para facilitar las pruebas.
    if (process.env.NODE_ENV !== 'production' && previewUrl) {
      responsePayload.previewURL = previewUrl;
    }

    return res.json(responsePayload);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  // 1. Hashear el token recibido para compararlo con el de la BD
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  try {
    // 2. Buscar en Firestore por el token hasheado y que no haya expirado
    const user = await findUserBy({ resetToken: hashedToken });

    if (!user || user.resetTokenExpiry <= Date.now()) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await updateUser(user.id, {
      passwordHash,
      resetToken: null,
      resetTokenExpiry: null
    });

    return res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al actualizar la contraseña' });
  }
};
export const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
};
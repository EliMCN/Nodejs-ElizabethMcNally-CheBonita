// services/user.service.js
import { db } from '../config/firebase.config.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/User.model.js';

/**
 * Busca un usuario por email
 * @param {string} email
 */
export async function findUserByEmail(email) {
  const query = await db.collection('users').where('email', '==', email).limit(1).get();
  if (query.empty) return null;
  const doc = query.docs[0];
  return { id: doc.id, ...doc.data() };
}

/**
 * Obtiene un usuario por ID
 * @param {string} id
 */
export async function getUserById(id) {
  const doc = await db.collection('users').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

/**
 * Busca un usuario por un campo y valor específicos.
 * @param {Object} query - ej: { resetToken: 'somehashedtoken' }
 */
export async function findUserBy(query) {
  const field = Object.keys(query)[0];
  const value = Object.values(query)[0];
  const snapshot = await db.collection('users').where(field, '==', value).limit(1).get();
  if (snapshot.empty) return null;
  
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

/**
 * Lista todos los usuarios (opcionalmente filtrado por rol)
 * @param {string} [role]
 */
export async function getAllUsersService(role) {
  let query = db.collection('users');
  if (role) query = query.where('role', '==', role);

  const snapshot = await query.get();
  return snapshot.docs.map(doc => doc.data());
}

/**
 * Crea un nuevo usuario con hash de contraseña
 * @param {Object} userData - name, email, password, role, etc.
 */
export async function createUser(userData) {
  const { name, email, password, role = 'cliente', address } = userData;

  // Validar si ya existe un usuario con ese email
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    // Si el usuario existe pero está inactivo, lo reactivamos con los nuevos datos.
    if (!existingUser.active) {
      const passwordHash = await bcrypt.hash(password, 10);
      const reactivatedUser = {
        name,
        passwordHash,
        address,
        active: true,
        role: role || 'cliente', // Asegurar que tenga un rol
        updatedAt: new Date() // Registrar la fecha de reactivación
      };
      await updateUser(existingUser.id, reactivatedUser);
      return { id: existingUser.id, name, email, role };
    } else {
      // Si el usuario existe y está activo, lanzamos el error.
      throw new Error('El correo ya está registrado.');
    }
  }

  // Si no existe, creamos uno nuevo.
  const id = uuidv4();
  const passwordHash = await bcrypt.hash(password, 10);
  
  const newUserInstance = new User({
    id,
    name,
    email,
    passwordHash,
    role,
    address,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  // Uso del modelo User
  newUserInstance.isValid();

  await db.collection('users').doc(id).set({ ...newUserInstance });
  return { id, name, email, role };
}

/**
 * Actualiza campos de un usuario
 * @param {string} id
 * @param {Object} updates
 */
export async function updateUser(id, updates) {
  const userRef = db.collection('users').doc(id);
  // Añadimos automáticamente la fecha de actualización a cada cambio.
  const dataToUpdate = {
    ...updates,
    updatedAt: new Date()
  };
  await userRef.update(dataToUpdate);
  return true;
}

/**
 * Cambia la contraseña de un usuario (requiere contraseña actual)
 * @param {string} id
 * @param {string} currentPassword
 * @param {string} newPassword
 */
export async function changePassword(id, currentPassword, newPassword) {
  const user = await getUserById(id);
  if (!user || !user.passwordHash) throw new Error('Usuario no válido');

  const match = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!match) throw new Error('Contraseña actual incorrecta');

  const newHash = await bcrypt.hash(newPassword, 10);
  await updateUser(id, { passwordHash: newHash });
  return true;
}

/**
 * Elimina un usuario (soft delete marcando como inactivo)
 * @param {string} id
 */
export async function deleteUser(id) {
  await db.collection('users').doc(id).update({ active: false });
  return true;
}

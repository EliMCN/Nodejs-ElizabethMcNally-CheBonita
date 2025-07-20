/**
 * @class User
 * Representa la estructura y las reglas de negocio de un usuario en la aplicación.
 * Proporciona un "contrato" claro para los objetos de usuario, mejorando la consistencia
 * y centralizando la lógica de la entidad.
 */
export class User {
  /**
   * Crea una instancia de Usuario.
   * @param {object} data - Los datos brutos del usuario.
   */
  constructor({
    id,
    name,
    email,
    passwordHash, // El hash se genera en el servicio, el modelo solo lo almacena.
    role = 'cliente',
    address = { street: '', city: '', zip: '' },
    active = true,
    createdAt,
    updatedAt,
    resetToken = null,
    resetTokenExpiry = null
  }) {
    this.id = id; // Será generado por el servicio si es un usuario nuevo.
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
    this.role = role;
    this.address = address;
    this.active = active;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.resetToken = resetToken;
    this.resetTokenExpiry = resetTokenExpiry;
  }

  /**
   * Valida los campos esenciales del usuario.
   * @returns {boolean} - True si el usuario es válido, de lo contrario lanza un error.
   */
  isValid() {
    if (!this.name || !this.email) {
      throw new Error('Los campos nombre y email son obligatorios.');
    }
    // Simple regex para validar el formato del email
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(this.email)) {
      throw new Error('El formato del email no es válido.');
    }
    return true;
  }
}
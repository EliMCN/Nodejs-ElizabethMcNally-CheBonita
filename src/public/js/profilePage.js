import { toastSuccess, toastError } from './toast.js';

document.addEventListener('DOMContentLoaded', () => {
  const profileForm = document.getElementById('profileForm');
  const deleteAccountBtn = document.getElementById('deleteAccountBtn');

  // 1. Cargar los datos del perfil al iniciar
  loadProfileData();

  // 2. Configurar el listener para el formulario de edición
  profileForm?.addEventListener('submit', handleUpdateProfile);

  // 3. Configurar el listener para el botón de eliminar cuenta
  deleteAccountBtn?.addEventListener('click', handleDeleteAccount);
});

async function loadProfileData() {
  try {
    const res = await fetch('/api/users/me', { credentials: 'include' });
    if (!res.ok) throw new Error('No se pudo cargar el perfil');

    const user = await res.json();

    // Poblar la tarjeta de información
    document.getElementById('profile-name').textContent = user.name;
    document.getElementById('profile-email').textContent = user.email;
    document.getElementById('profile-role').textContent = user.role;

    // Poblar el formulario de edición
    document.getElementById('name').value = user.name;
    document.getElementById('street').value = user.address?.street || '';

  } catch (err) {
    console.error(err);
    toastError('Error al cargar los datos del perfil.');
  }
}

async function handleUpdateProfile(e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const street = document.getElementById('street').value;

  // Asumimos que la ciudad y el zip se podrían añadir en el futuro
  // Por ahora, los dejamos vacíos o los tomamos de los datos existentes si los hubiera.
  const address = { street, city: '', zip: '' };

  try {
    const res = await fetch('/api/users/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, address })
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'No se pudo actualizar el perfil');
    }

    toastSuccess('Perfil actualizado correctamente');
    // Actualizar el nombre en la tarjeta de perfil sin recargar la página
    document.getElementById('profile-name').textContent = name;

  } catch (err) {
    console.error(err);
    toastError(err.message);
  }
}

async function handleDeleteAccount() {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: "Esta acción marcará tu cuenta como inactiva y cerrará tu sesión. Podrás reactivarla registrándote de nuevo con el mismo email.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar mi cuenta',
    cancelButtonText: 'Cancelar'
  });

  if (!result.isConfirmed) return;

  try {
    const res = await fetch('/api/users/me', { method: 'DELETE', credentials: 'include' });
    if (!res.ok) throw new Error('No se pudo eliminar la cuenta');

    toastSuccess('Cuenta eliminada. Serás redirigido.');
    setTimeout(() => window.location.replace('/auth/login.html'), 2500);

  } catch (err) {
    console.error(err);
    toastError(err.message);
  }
}
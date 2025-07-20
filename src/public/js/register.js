import { toastInfo, toastSuccess, toastError } from './toast.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Primero, verificar si el usuario ya está logueado
  try {
    const res = await fetch('/api/users/me', { credentials: 'include' });
    if (res.ok) {
      const user = await res.json();
      toastInfo(`Ya has iniciado sesión. Redirigiendo...`);
      document.getElementById('registerForm').style.display = 'none';
      setTimeout(() => {
        window.location.replace(user.role === 'admin' ? '/admin/index.html' : '/');
      }, 2000);
      return;
    }
  } catch (err) {
    console.error('Error al verificar sesión:', err);
  }

  // Si el usuario no está logueado, configurar el formulario.
  const form = document.getElementById('registerForm');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const street = document.getElementById('street').value;
    const city = document.getElementById('city').value;
    const zip = document.getElementById('zip').value;

    const role = document.getElementById('role')?.value || 'cliente';

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          address: { street, city, zip }
        })
      });

      const data = await res.json();

      if (res.ok) {
        toastSuccess('Usuario registrado correctamente. Redirigiendo al login...');
        setTimeout(() => window.location.replace('/auth/login.html'), 2500);
      } else {
        toastError(data.error || 'Error del servidor');
      }
    } catch (error) {
      console.error(error);
      toastError('Error de red o del servidor');
    }
  });
});
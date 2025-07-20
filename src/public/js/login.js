import { toastSuccess, toastError, toastInfo } from './toast.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Primero, verificar si el usuario ya está logueado
  try {
    const res = await fetch('/api/users/me', { credentials: 'include' });
    if (res.ok) {
      const user = await res.json();
      toastInfo(`Ya has iniciado sesión. Redirigiendo...`);
      document.getElementById('loginForm').style.display = 'none';
      setTimeout(() => {
        window.location.replace(user.role === 'admin' ? '/admin/index.html' : '/');
      }, 2000);
      return;
    }
  } catch (err) {
    console.error('Error al verificar sesión:', err);
  }

  // Si el usuario no está logueado, configurar el formulario.
  document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
      toastError('Todos los campos son obligatorios.');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Email o contraseña inválidos');

      const role = data.user?.role;
      toastSuccess(`Bienvenido/a ${data.user?.name || ''}`);

      setTimeout(() => {
        window.location.replace(role === 'admin' ? '/admin/index.html' : '/');
      }, 1000);
    } catch (err) {
      toastError(err.message || 'Error al iniciar sesión');
      console.error(err);
    }
  });
});

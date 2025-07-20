import { toastSuccess, toastError } from './toast.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('resetPasswordForm');
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (!token) {
    toastError("Token inválido o faltante.");
    form.style.display = "none";
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
      toastError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });

      const data = await res.json();

      if (res.ok) {
        toastSuccess("Contraseña restablecida. Redirigiendo al login...");
        setTimeout(() => window.location.replace('/auth/login.html'), 2500);
      } else {
        toastError(data.error || "Error en el servidor.");
      }
    } catch (error) {
      console.error(error);
      toastError("Error al contactar al servidor.");
    }
  });
});

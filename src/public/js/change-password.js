 import { toastSuccess, toastWarning, toastError } from './toast.js';
 
 document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('changePasswordForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
     toastWarning('Las contraseñas no coinciden. Asegurate de que ambas sean iguales.');
      return;
    }

    try {
      const res = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // cookies httpOnly
        body: JSON.stringify({
          currentPassword: oldPassword,
          newPassword: newPassword
        })
      });

      const data = await res.json();

      if (res.ok) {
        toastSuccess('Contraseña actualizada correctamente. Redirigiendo al login...');
setTimeout(() => {
  window.location.href = '/auth/login.html';
}, 3000);
      } else {
        toastError(data.error || 'No se pudo cambiar la contraseña.');
        console.error(data.error);
      }
    } catch (err) {
      console.error(err);
     toastError('No se pudo conectar con el servidor. Intentalo más tarde.');
    }
  });
});

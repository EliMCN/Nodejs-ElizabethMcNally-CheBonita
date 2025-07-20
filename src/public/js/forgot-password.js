import { toastSuccess, toastError, toastInfo } from './toast.js';

// public/js/forgot-password.js
document.addEventListener('DOMContentLoaded', async () => {
  // Primero, verificar si el usuario ya está logueado
  try {
    const res = await fetch('/api/users/me', { credentials: 'include' });
    if (res.ok) {
      const user = await res.json();
      toastInfo(`Ya has iniciado sesión. Redirigiendo...`);
      // Ocultar el formulario para evitar interacción mientras se redirige
      document.getElementById('forgotPasswordForm').style.display = 'none';
      setTimeout(() => {
        window.location.replace(user.role === 'admin' ? '/admin/index.html' : '/');
      }, 2000);
      return; // Detener la ejecución para no añadir el listener del formulario
    }
  } catch (err) {
    // Si hay un error de red, simplemente continuamos y mostramos el formulario.
    console.error('Error al verificar sesión:', err);
  }

  // Si el usuario no está logueado, configurar el formulario.
  const form = document.getElementById('forgotPasswordForm');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
  
  const submitBtn = document.getElementById('submitBtn');
  const originalBtnText = submitBtn.innerHTML;

  // Deshabilitar botón y mostrar spinner para dar feedback al usuario
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Enviando...
  `;

  const email = document.getElementById('email').value;

  try {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (res.ok) {
      // Si estamos en desarrollo y el backend nos dio el link de Ethereal, lo mostramos.
      if (data.previewURL) {
        Swal.fire({
          title: 'Enlace de Desarrollo',
          icon: 'info',
          html: `El correo de reseteo se ha generado. <br/><br/> <a href="${data.previewURL}" target="_blank" class="btn btn-primary"><b>Ver Correo de Prueba</b></a>`,
          confirmButtonText: 'Entendido'
        });
      } else {
        toastSuccess("Si el correo existe, recibirás un enlace de recuperación.");
        setTimeout(() => window.location.href = '/auth/login.html', 3000);
      }
    } else {
      toastError(data.error || "Ocurrió un problema.");
    }
  } catch (err) {
    console.error(err);
    toastError("Error de red o del servidor.");
  } finally {
    // Volver a habilitar el botón y restaurar su texto original, tanto en caso de éxito como de error.
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
  });
});

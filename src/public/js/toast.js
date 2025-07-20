// public/js/utils/toast.js

export function toastSuccess(message = 'Operación exitosa') {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: message,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true
  });
}

export function toastError(message = 'Ocurrió un error') {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'error',
    title: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });
}

export function toastWarning(message = 'Advertencia') {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'warning',
    title: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });
}

export function toastInfo(message = 'Información') {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'info',
    title: message,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true
  });
}

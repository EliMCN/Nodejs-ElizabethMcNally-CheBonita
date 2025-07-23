// public/js/adminUsers.js
import { toastError, toastSuccess } from './toast.js';

const tableBody = document.querySelector('#usersTable tbody');
const roleFilter = document.getElementById('roleFilter');
const createUserForm = document.getElementById('createUserForm');
const createUserModalEl = document.getElementById('createUserModal');
const editUserForm = document.getElementById('editUserForm');
const editUserModalEl = document.getElementById('editUserModal');

const createUserModal = createUserModalEl ? new bootstrap.Modal(createUserModalEl) : null;

let allUsers = [];

// Fetch y renderizado inicial
fetchUsers();

// Listener para filtro por rol
roleFilter.addEventListener('change', () => {
  const role = roleFilter.value;
  renderUsers(role);
});

// Event Delegation para los botones de acción
tableBody.addEventListener('click', (e) => {
  const target = e.target.closest('button');
  if (!target) return;

  const userId = target.dataset.id;
  // Buscamos el usuario una sola vez aquí
  const user = allUsers.find(u => u.id === userId);
  if (!user) return;

  if (target.classList.contains('view-user-btn')) {
    showUserModal(user); // Pasamos el objeto completo
  }

  if (target.classList.contains('edit-user-btn')) {
    showEditModal(user); // Pasamos el objeto completo
  }

  if (target.classList.contains('deactivate-user-btn')) {
    deactivateUser(user.id); // Aquí solo necesitamos el ID
  }
});

// Listener para el formulario de creación de usuario
createUserForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('newUserName').value;
  const email = document.getElementById('newUserEmail').value;
  const password = document.getElementById('newUserPassword').value;
  const role = document.getElementById('newUserRole').value;
  
  // Recolectar los datos de la dirección
  const address = {
    street: document.getElementById('newUserStreet').value,
    city: document.getElementById('newUserCity').value,
    postalCode: document.getElementById('newUserPostalCode').value
  };

  try {
    // Reutilizamos el endpoint de registro, que ya maneja la creación de usuarios
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password, role, address })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'No se pudo crear el usuario');
    }

    toastSuccess('Usuario creado correctamente');
    createUserModal.hide(); // Ocultar el modal
    createUserForm.reset(); // Limpiar el formulario
    await fetchUsers(); // Recargar la lista de usuarios

  } catch (err) {
    console.error(err);
    toastError(err.message);
  }
});

// Listener para el formulario de edición de usuario
editUserForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('editUserId').value;
  const name = document.getElementById('editUserName').value;
  const email = document.getElementById('editUserEmail').value;
  const active = document.getElementById('editUserActive').checked;

  // Recolectamos los datos de la dirección
  const address = {
    street: document.getElementById('editUserStreet').value,
    city: document.getElementById('editUserCity').value,
    postalCode: document.getElementById('editUserPostalCode').value
  };

  try {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      // Enviamos el objeto de datos actualizado, sin el rol y con la dirección
      body: JSON.stringify({ name, email, active, address })
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'No se pudo actualizar el usuario');
    }

    toastSuccess('Usuario actualizado correctamente');
    const editModal = bootstrap.Modal.getInstance(editUserModalEl);
    editModal.hide();
    await fetchUsers(); // Recargar la lista de usuarios

  } catch (err) {
    console.error(err);
    toastError(err.message);
  }
});

async function fetchUsers() {
  try {
    
    const res = await fetch('/api/admin/users', {
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Error al obtener usuarios');
    allUsers = await res.json();
    renderUsers();
  } catch (err) {
    console.error(err);
    toastError('No se pudieron cargar los usuarios');
  }
}

function renderUsers(role = '') {
  tableBody.innerHTML = '';
  const filtered = role ? allUsers.filter(u => u.role === role) : allUsers;

  if (filtered.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `<td colspan="5" class="text-center">No se encontraron usuarios</td>`;
    tableBody.appendChild(row);
    return;
  }

  filtered.forEach(user => {
    const row = document.createElement('tr');   
    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>${user.active ? 'Sí' : 'No'}</td>
      <td class="actions-cell">
        <button class="btn btn-sm btn-outline-info me-2 view-user-btn" data-id="${user.id}">Ver</button>
        <button class="btn btn-sm btn-outline-secondary me-2 edit-user-btn" data-id="${user.id}">Editar</button>
        ${user.role !== 'admin' && user.active ? `<button class="btn btn-sm btn-outline-danger deactivate-user-btn" data-id="${user.id}">Desactivar</button>` : ''}
      </td>
    `;
    tableBody.appendChild(row);
  });
}


function showUserModal(user) {
  // Ya no es necesario buscar el usuario, lo recibimos directamente
  document.getElementById('modalName').textContent = user.name;
  document.getElementById('modalEmail').textContent = user.email;
  document.getElementById('modalRole').textContent = user.role;

  // Construimos la dirección de forma segura, mostrando solo las partes que existen.
  let addressString = 'No especificada';
  if (user.address) {
    const parts = [user.address.street, user.address.city, user.address.postalCode];
    // Filtramos las partes vacías y las unimos con comas.
    addressString = parts.filter(p => p).join(', ') || 'No especificada';
  }
  const address = addressString;
  document.getElementById('modalAddress').textContent = address;

  const modal = new bootstrap.Modal(document.getElementById('userModal'));
  modal.show();
}

function showEditModal(user) {
  // Ya no es necesario buscar el usuario, lo recibimos directamente
  document.getElementById('editUserId').value = user.id;
  document.getElementById('editUserName').value = user.name;
  document.getElementById('editUserEmail').value = user.email;
  document.getElementById('editUserActive').checked = user.active;
  // Rellenamos los campos de dirección, usando valores vacíos si no existen.
  document.getElementById('editUserStreet').value = user.address?.street || '';
  document.getElementById('editUserCity').value = user.address?.city || '';
  document.getElementById('editUserPostalCode').value = user.address?.postalCode || '';

  // Mostrar el modal de edición
  const editModal = new bootstrap.Modal(editUserModalEl);
  editModal.show();
}

async function deactivateUser(id) {
  const confirm = await Swal.fire({
    title: '¿Desactivar usuario?',
    text: 'Esta acción deshabilitará el acceso del usuario.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, desactivar',
    cancelButtonText: 'Cancelar'
  });

  if (!confirm.isConfirmed) return;

  try {   
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) throw new Error('Error al desactivar usuario');

    toastSuccess('Usuario desactivado');
    await fetchUsers();
  } catch (err) {
    console.error(err);
    toastError('No se pudo desactivar el usuario');
  }
}

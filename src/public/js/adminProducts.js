import { toastSuccess, toastError } from './toast.js';

const tableBody = document.querySelector('#productsTable tbody');
const createProductBtn = document.getElementById('createProductBtn');
const productModalEl = document.getElementById('productModal');
const productModal = new bootstrap.Modal(productModalEl);
const productForm = document.getElementById('productForm');
const modalTitle = document.getElementById('productModalLabel');
const productSearchInput = document.getElementById('productSearchInput');

let allProducts = [];
let uniqueCategories = [];

// Fetch y renderizado inicial
fetchProducts();

// --- EVENT LISTENERS ---

// Listener para el buscador
productSearchInput.addEventListener('input', () => {
  const searchTerm = productSearchInput.value.toLowerCase();
  if (!searchTerm) {
    renderProducts(allProducts); // Si la búsqueda está vacía, mostrar todos
    return;
  }
  const filteredProducts = allProducts.filter(p =>
    p.title.toLowerCase().includes(searchTerm)
  );
  renderProducts(filteredProducts);
});

// Abrir modal para crear
createProductBtn.addEventListener('click', () => {
  productForm.reset();
  document.getElementById('productId').value = '';
  modalTitle.textContent = 'Crear Nuevo Producto';
  productModal.show();
});

// Enviar formulario (Crear o Editar)
productForm.addEventListener('submit', handleFormSubmit);

// Delegación de eventos para botones de editar y eliminar
tableBody.addEventListener('click', (e) => {
  const target = e.target.closest('button');
  if (!target) return;

  const productId = target.dataset.id;

  if (target.classList.contains('edit-btn')) {
    handleEdit(productId);
  } else if (target.classList.contains('delete-btn')) {
    handleDelete(productId);
  }
});


// --- CRUD FUNCTIONS ---

async function fetchProducts() {
  try {
    const res = await fetch('/api/products'); // Usa el endpoint público para leer
    const products = await res.json();
    if (!res.ok) throw new Error(products.error || 'Error al obtener productos');

    allProducts = products; // Guardar para la búsqueda

    // Obtener y poblar categorías solo una vez
    if (uniqueCategories.length === 0) {
      uniqueCategories = [...new Set(products.map(p => p.category).flat().filter(Boolean))];
      populateCategoryDropdown();
    }

    renderProducts(allProducts);
  } catch (err) {
    console.error(err);
    toastError('No se pudieron cargar los productos');
  }
}

function populateCategoryDropdown() {
  const categorySelect = document.getElementById('category');
  if (!categorySelect) return;

  categorySelect.innerHTML = '<option value="">Seleccione una categoría...</option>';
  uniqueCategories.sort().forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categorySelect.appendChild(option);
  });
}

function renderProducts(products) {
  tableBody.innerHTML = '';
  if (products.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No hay productos para mostrar.</td></tr>';
    return;
  }

  products.forEach(product => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><img src="${product.image || '/img/logo.webp'}" alt="${product.title}" width="50"></td>
      <td>${product.title}</td>
      <td>${Array.isArray(product.category) ? product.category.join(', ') : product.category}</td>
      <td>$${product.price.toFixed(2)}</td>
      <td>${product.stock}</td>
      <td>
        <button class="btn btn-sm btn-outline-secondary edit-btn" data-id="${product.id}">Editar</button>
        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${product.id}">Eliminar</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

async function handleFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('productId').value;
  const productData = {
    title: document.getElementById('title').value,
    price: parseFloat(document.getElementById('price').value),
    description: document.getElementById('description').value,
    category: document.getElementById('category').value,
    stock: parseInt(document.getElementById('stock').value, 10),
    brand: document.getElementById('brand').value,
    image: document.getElementById('image').value,    
    // Convertir el textarea de imágenes en un array de strings, eliminando líneas vacías
    images: document.getElementById('images').value.trim().split('\n').filter(url => url.trim() !== ''),
    discountPercentage: parseFloat(document.getElementById('discountPercentage').value),
    rating: parseFloat(document.getElementById('rating').value),
    specialEdition: document.getElementById('specialEdition').checked,
    isGiftCard: document.getElementById('isGiftCard').checked,
 };
  const isEditing = !!id;
  const url = isEditing ? `/api/admin/products/${id}` : '/api/admin/products';
  const method = isEditing ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(productData)
    });

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.errors ? data.errors[0].msg : (data.error || 'Error al guardar el producto'));
      }
      toastSuccess(`Producto ${isEditing ? 'actualizado' : 'creado'} correctamente`);
      productModal.hide();
      fetchProducts(); // Recargar la lista
    } else {
      const errorText = await res.text();
      console.error("Respuesta no válida del servidor:", errorText);
      throw new Error('El servidor no respondió correctamente. Revisa la consola del servidor.');
    }
  } catch (err) {
    console.error(err);
    toastError(err.message);
  }
}

async function handleEdit(id) {
  try {
    const res = await fetch(`/api/products/${id}`); // Leer datos del endpoint público
    if (!res.ok) throw new Error('Producto no encontrado');
    const product = await res.json();

    // Poblar el formulario
    document.getElementById('productId').value = product.id;
    document.getElementById('title').value = product.title;
    document.getElementById('price').value = product.price;
    document.getElementById('description').value = product.description || '';
    document.getElementById('category').value = Array.isArray(product.category) ? product.category.join(', ') : product.category;
    document.getElementById('stock').value = product.stock;
    document.getElementById('brand').value = product.brand || '';
    document.getElementById('image').value = product.image || '';
    // Convertir el array de imágenes en un string con saltos de línea para el textarea
    document.getElementById('images').value = (product.images || []).join('\n');
    document.getElementById('discountPercentage').value = product.discountPercentage || 0;
    document.getElementById('rating').value = product.rating || 0;
    document.getElementById('specialEdition').checked = product.specialEdition || false;
    document.getElementById('isGiftCard').checked = product.isGiftCard || false; 
    

    modalTitle.textContent = 'Editar Producto';
    productModal.show();
  } catch (err) {
    console.error(err);
    toastError(err.message);
  }
}

async function handleDelete(id) {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: "Esta acción eliminará el producto permanentemente.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (!result.isConfirmed) return;

  try {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'No se pudo eliminar el producto');
    }

    toastSuccess('Producto eliminado correctamente');
    fetchProducts(); // Recargar la lista
  } catch (err) {
    console.error(err);
    toastError(err.message);
  }
}
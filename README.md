# Che Bonita - eCommerce Full-Stack
Este proyecto es un sitio web de eCommerce full-stack para "Che Bonita", una tienda de moda y accesorios. Originalmente concebido como un proyecto frontend para el curso Talento Tech (puedes visitar la versión original [aquí](https://github.com/EliMCN/CheBonita)), ha evolucionado para incluir un backend robusto con Node.js y Express, una base de datos en la nube con Google Firestore, y un sistema completo de autenticación y gestión.

La plataforma ofrece una experiencia de usuario atractiva y responsive, permitiendo a los clientes explorar colecciones, buscar productos, gestionar su carrito de compras y a los administradores gestionar el catálogo y los usuarios desde un panel dedicado.

## Características Principales
Para Clientes:
Catálogo de Productos Dinámico: Productos cargados desde la base de datos con paginación "Cargar más".
Búsqueda y Filtrado: Búsqueda por texto y filtrado por categorías.
Detalle de Producto: Vistas detalladas con múltiples imágenes (thumbnails).
Carrito de Compras Persistente: Utiliza Local Storage para guardar el carrito entre sesiones.
Autenticación de Usuarios: Registro e inicio de sesión con validación.
Recuperación de Contraseña: Sistema de reseteo de contraseña vía email (utilizando Nodemailer y Ethereal para pruebas).
Perfil de Usuario: Los usuarios pueden ver y actualizar sus datos personales.
Para Administradores:
Panel de Administración: Dashboard con estadísticas clave (ventas, usuarios, stock bajo).
Gestión de Productos (CRUD): Crear, leer, actualizar y eliminar productos a través de una interfaz gráfica.
Gestión de Usuarios (CRUD): Crear, leer, actualizar y desactivar usuarios.

##  Arquitectura del Proyecto
El proyecto está construido con una arquitectura desacoplada que separa claramente las responsabilidades del frontend y el backend.

Backend (Node.js / Express): Actúa como el cerebro de la aplicación.

Sirve una API RESTful bajo la ruta /api/ para gestionar productos, usuarios y autenticación.
Maneja la lógica de negocio y la comunicación con la base de datos Firestore.
Gestiona la autenticación mediante tokens JWT almacenados en cookies httpOnly para mayor seguridad.
Sirve los archivos estáticos del frontend (HTML, CSS, JS).
Frontend (HTML, CSS, Vanilla JS): Es la cara visible de la aplicación.

Consume la API del backend para mostrar productos, gestionar el carrito y manejar las sesiones de usuario.
No contiene lógica de negocio crítica, asegurando que la validación principal ocurra en el servidor.
Base de Datos (Google Firestore): Una base de datos NoSQL en la nube que almacena la información de productos y usuarios, ofreciendo escalabilidad y flexibilidad.

##  Tecnologías Utilizadas
Backend
Node.js: Entorno de ejecución de JavaScript.
Express.js: Framework para construir la API y servir el frontend.
Google Firestore: Base de datos NoSQL para persistencia de datos.
JSON Web Tokens (JWT): Para manejar sesiones de usuario seguras.
bcrypt.js: Para el hasheo seguro de contraseñas.
Nodemailer: Para el envío de correos de recuperación de contraseña (con Ethereal para desarrollo).
CORS, Helmet, Morgan: Middlewares para seguridad y logging.
dotenv: Para la gestión de variables de entorno.
Frontend
HTML5 y CSS3: Para la estructura y estilos.
JavaScript (ES Modules): Para la lógica del cliente y la interactividad.
Bootstrap 5: Para un diseño responsive y componentes de UI.
SweetAlert2: Para notificaciones y alertas atractivas.
Desarrollo y Despliegue
Nodemon: Para reiniciar el servidor automáticamente durante el desarrollo.
Vercel: Plataforma de despliegue optimizada para este tipo de proyectos.

##  Instrucciones para Ejecutar el Proyecto
Para ejecutar este proyecto en tu máquina local, sigue estos pasos:

1. Prerrequisitos
Tener instalado Node.js (versión 18 o superior).
Tener una cuenta de Firebase con un proyecto y Firestore habilitado.
2. Clonar el Repositorio
```bash
git clone https://github.com/EliMCN/Nodejs-ElizabethMcNally-CheBonita.git
cd Chebonita-backend
```
3. Instalar Dependencias
```bash
npm install
```
4. Configurar Variables de Entorno
Crea un archivo .env en la raíz del proyecto y añade las siguientes variables. Necesitarás generar un archivo de credenciales de servicio desde tu proyecto de Firebase.

```env
# Clave secreta para firmar los tokens JWT
JWT_SECRET=tu_clave_super_secreta_aqui

# Credenciales de Firebase (obtenidas desde tu consola de Firebase)
# Asegúrate de que el JSON esté en una sola línea o usa comillas.
FIREBASE_PROJECT_ID="tu-project-id"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...tu-clave-privada...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-...@tu-project-id.iam.gserviceaccount.com"
```
5. Ejecutar el Servidor en Modo Desarrollo
```bash
npm run dev
```
El servidor se iniciará en http://localhost:4000.

##  Scripts Disponibles
npm run dev: Inicia el servidor con nodemon para desarrollo.
npm start: Inicia el servidor en modo producción.
npm run import-products: Ejecuta un script para poblar la base de datos de Firestore con productos desde un archivo JSON local.
npm run import-users: Ejecuta un script para poblar la base de datos con usuarios de prueba.

##  Despliegue
El proyecto está configurado para un despliegue sencillo en Vercel. El archivo vercel.json en la raíz del proyecto contiene las directivas necesarias para que Vercel construya y sirva correctamente tanto el backend como el frontend.

Para desplegar, simplemente importa el repositorio de GitHub en Vercel y asegúrate de configurar las mismas variables de entorno que usaste en tu archivo .env en el panel de configuración del proyecto de Vercel.

##  Autor
Che Bonita fue desarrollado por Elizabeth Mc Nally. Para cualquier consulta, no dudes en contactarme.

¡Gracias por visitar Che Bonita! ❤️ Sentite Bonita ❤️
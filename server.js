//server.js

import 'dotenv/config';  
console.log('JWT_SECRET cargado:', process.env.JWT_SECRET);


import app from './src/app.js';
// Este bloque solo se ejecutará en desarrollo local, no en Vercel.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

// Vercel 
export default app;
export function errorHandler(err, req, res, next) {
  console.error(err.stack); // Log del error para depuración

  // Si el error viene de una validación o un conflicto conocido
  if (err.message.includes('Ya existe un producto con ese título')) {
    return res.status(409).json({ error: err.message }); // 409 Conflict
  }

  // Error genérico del servidor
  res.status(500).json({ error: 'Internal Server Error' });
}

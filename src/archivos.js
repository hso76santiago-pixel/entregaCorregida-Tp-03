const fs = require('node:fs/promises');

async function leerInstrumentos(ruta) {
  try {
    const contenido = await fs.readFile(ruta, 'utf8');
    return JSON.parse(contenido);
  } catch (error) {
    // Lanza el error para que index.js informe el fallo de inicio
    throw new Error(`No se pudo leer o interpretar el archivo JSON: ${error.message}`);
  }
}

module.exports = {
  leerInstrumentos
};
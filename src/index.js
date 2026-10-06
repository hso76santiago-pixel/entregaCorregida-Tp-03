const express = require('express');
const path = require('node:path');
const { leerInstrumentos } = require('./archivos');

const PORT = process.env.PORT || 3000;

async function main() {
  let instrumentos = [];

  // 1. Carga asíncrona previa al inicio del servidor
  try {
    const rutaJson = path.join(__dirname, '..', 'datos', 'instrumentos.json');
    instrumentos = await leerInstrumentos(rutaJson);
    console.log('Datos cargados exitosamente antes de iniciar el servidor.');
  } catch (error) {
    console.error('Error de inicio al leer los datos:', error.message);
    process.exit(1);
  }

  const app = express();

  // Middleware para parsear bodies JSON
  app.use(express.json());

  // Endpoint 1: Bienvenida
  app.get('/', (req, res) => {
    res.status(200).json({
      mensaje: 'API de instrumentos disponible'
    });
  });

  // Endpoint 2: Listado y filtro por query
  app.get('/api/instrumentos', (req, res) => {
    const { familia } = req.query;

    if (familia) {
      // Filtrar sin modificar la colección original y sin distinguir mayúsculas/minúsculas
      const filtrados = instrumentos.filter(
        (inst) => inst.familia.toLowerCase() === familia.toLowerCase()
      );
      // Si no hay coincidencias devuelve 200 y []
      return res.status(200).json(filtrados);
    }

    res.status(200).json(instrumentos);
  });

  // Endpoint 3: Detalle por ID
  app.get('/api/instrumentos/:id', (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'El identificador debe ser numérico' });
    }

    const instrumento = instrumentos.find((inst) => inst.id === id);

    if (!instrumento) {
      return res.status(404).json({ error: 'Instrumento no encontrado' });
    }

    res.status(200).json(instrumento);
  });

  // Endpoint 4: Creación en memoria RAM (sin escribir en JSON)
  app.post('/api/instrumentos', (req, res) => {
    const { nombre, familia, origen, descripcion, disponible } = req.body;

    // Validación estricta de campos obligatorios (disponible: false es un valor válido)
    if (
      !nombre ||
      !familia ||
      !origen ||
      !descripcion ||
      disponible === undefined
    ) {
      return res.status(400).json({
        error: 'Todos los campos son obligatorios: nombre, familia, origen, descripcion y disponible.'
      });
    }

    // Generar ID a partir del último registro existente
    const ultimoId = instrumentos.length > 0 ? instrumentos[instrumentos.length - 1].id : 0;
    const nuevoId = ultimoId + 1;

    const nuevoInstrumento = {
      id: nuevoId,
      nombre,
      familia,
      origen,
      descripcion,
      disponible: Boolean(disponible)
    };

    // Agregar recurso en memoria
    instrumentos.push(nuevoInstrumento);

    // Responder 201 y devolver el objeto creado
    res.status(201).json(nuevoInstrumento);
  });

  // Iniciar el servidor Express solo tras disponer de los datos
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

main();
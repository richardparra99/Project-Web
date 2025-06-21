const pool = require('../conexion/db');
const path = require('path');

const subirImagenes = async (req, res) => {
  try {
    const archivos = req.files;

    if (!archivos || archivos.length === 0) {
      return res.status(400).json({ mensaje: "No se subieron imágenes." });
    }

    const resultados = [];

    for (const file of archivos) {
      const result = await pool.query(
        `INSERT INTO imagen (nombre, path, temporal)
         VALUES ($1, $2, true)
         RETURNING *`,
        [file.originalname, `/uploads/${file.filename}`]
      );

      resultados.push(result.rows[0]);
    }

    res.status(201).json(resultados);
  } catch (error) {
    console.error("Error al subir imagen:", error);
    res.status(500).json({ mensaje: "Error al subir imagen." });
  }
};

const asignarImagenesAAnuncio = async (req, res) => {
  const { anuncioId } = req.params;
  const { imagenIds } = req.body;

  if (!Array.isArray(imagenIds)) {
    return res.status(400).json({ mensaje: "imagenIds debe ser un array." });
  }

  try {
    const result = await pool.query(
      `UPDATE imagen SET anuncio_id = $1, temporal = false WHERE id = ANY($2::int[]) RETURNING *`,
      [anuncioId, imagenIds]
    );

    res.json({ mensaje: "Imágenes asignadas", imagenes: result.rows });
  } catch (error) {
    console.error("Error al asignar imágenes:", error);
    res.status(500).json({ mensaje: "Error al asignar imágenes." });
  }
};

const obtenerImagenesPorAnuncio = async (req, res) => {
  const { anuncioId } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM imagen WHERE anuncio_id = $1`,
      [anuncioId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener imágenes:", error);
    res.status(500).json({ mensaje: "Error al obtener imágenes." });
  }
};

module.exports = {
  subirImagenes,
  asignarImagenesAAnuncio,
  obtenerImagenesPorAnuncio,
};

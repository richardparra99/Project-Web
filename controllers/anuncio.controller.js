const pool = require('../conexion/db');

const crearAnuncio = async (req, res) => {
  const { titulo, descripcion, precio, imagenes, usuario_id, categoria_nombre } = req.body;

  try {
    // 1. Buscar o crear la categoría
    let categoriaId;
    const catResult = await pool.query('SELECT id FROM categoria WHERE nombre = $1', [categoria_nombre]);
    if (catResult.rows.length > 0) {
      categoriaId = catResult.rows[0].id;
    } else {
      const insertCat = await pool.query(
        'INSERT INTO categoria (nombre, descripcion) VALUES ($1, $2) RETURNING id',
        [categoria_nombre, '']
      );
      categoriaId = insertCat.rows[0].id;
    }

    // 2. Asumimos que el estado inicial es "Publicado" (o crea uno por defecto si no existe)
    const estadoResult = await pool.query('SELECT id FROM estado_anuncio WHERE nombre = $1', ['Publicado']);
    const estadoId = estadoResult.rows.length > 0
      ? estadoResult.rows[0].id
      : (await pool.query('INSERT INTO estado_anuncio (nombre) VALUES ($1) RETURNING id', ['Publicado'])).rows[0].id;

    // 3. Crear anuncio
    await pool.query(
      `INSERT INTO anuncio (titulo, descripcion, precio, imagenes, usuario_id, categoria_id, estado_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [titulo, descripcion, precio, imagenes, usuario_id, categoriaId, estadoId]
    );

    res.status(201).json({ mensaje: "Anuncio creado correctamente." });
  } catch (error) {
    console.error("Error al crear anuncio:", error);
    res.status(500).json({ mensaje: "Error del servidor al crear el anuncio." });
  }
};

const obtenerAnunciosPorUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
  SELECT a.id, a.titulo, a.descripcion, a.precio, ea.nombre AS estado
  FROM anuncio a
  LEFT JOIN estado_anuncio ea ON a.estado_id = ea.id
  WHERE a.usuario_id = $1
`, [id]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener anuncios:", error);
    res.status(500).json({ mensaje: "Error del servidor." });
  }
};


const cambiarEstadoAnuncio = async (req, res) => {
  const { id } = req.params;

  try {
    // Obtener estado actual
    const actual = await pool.query('SELECT estado_id FROM anuncio WHERE id = $1', [id]);
    const estadoActual = actual.rows[0]?.estado_id;

    // Buscar el nuevo estado_id (1: Publicado, 2: Inactivo)
    const nuevoEstadoId = estadoActual === 1 ? 2 : 1;

    await pool.query('UPDATE anuncio SET estado_id = $1 WHERE id = $2', [nuevoEstadoId, id]);

    res.status(200).json({ mensaje: 'Estado actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al cambiar estado del anuncio' });
  }
};



const eliminarAnuncio = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM anuncio WHERE id = $1', [id]);
    res.status(200).json({ mensaje: 'Anuncio eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar anuncio' });
  }
};


const obtenerAnunciosDestacados = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.id, a.titulo, a.descripcion, a.precio
      FROM anuncio a
      INNER JOIN estado_anuncio ea ON a.estado_id = ea.id
      WHERE ea.nombre = 'Publicado'
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al cargar anuncios destacados' });
  }
};





module.exports = { 
  crearAnuncio, obtenerAnunciosPorUsuario, 
  cambiarEstadoAnuncio, eliminarAnuncio, obtenerAnunciosDestacados };
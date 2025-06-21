const pool = require('../conexion/db');

const crearAnuncio = async (req, res) => {
  try {
    const { titulo, descripcion, precio, usuario_id, categoria_nombre } = req.body;

    // 🔥 Capturar imágenes desde req.files
    const imagenes = req.files?.map(file => ({
      nombre: file.originalname,
      path: `/uploads/${file.filename}`,
      temporal: false
    })) || [];

    // Buscar o crear categoría
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

    // Buscar o crear estado "Publicado"
    const estadoResult = await pool.query('SELECT id FROM estado_anuncio WHERE nombre = $1', ['Publicado']);
    const estadoId = estadoResult.rows.length > 0
      ? estadoResult.rows[0].id
      : (await pool.query('INSERT INTO estado_anuncio (nombre) VALUES ($1) RETURNING id', ['Publicado'])).rows[0].id;

    // Insertar anuncio (sin imagenes ahora)
    const result = await pool.query(
      `INSERT INTO anuncio (titulo, descripcion, precio, usuario_id, categoria_id, estado_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [titulo, descripcion, precio, usuario_id, categoriaId, estadoId]
    );

    const anuncioId = result.rows[0].id;

    // Insertar imágenes asociadas al anuncio
    for (const img of imagenes) {
      await pool.query(
        `INSERT INTO imagen (nombre, path, temporal, fecha_subida, anuncio_id)
         VALUES ($1, $2, $3, NOW(), $4)`,
        [img.nombre, img.path, img.temporal, anuncioId]
      );
    }

    res.status(201).json({ mensaje: "Anuncio creado con éxito", anuncioId });
  } catch (error) {
    console.error("Error al crear anuncio:", error);
    res.status(500).json({ mensaje: "Error del servidor al crear el anuncio." });
  }
};

const obtenerAnunciosPorUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT a.id, a.titulo, a.descripcion, a.precio, ea.nombre AS estado,
        (
          SELECT json_agg(i.*) FROM imagen i WHERE i.anuncio_id = a.id
        ) AS imagenes
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

const obtenerAnunciosPublicos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.id,
        a.titulo,
        a.descripcion,
        a.precio,
        u.nombre_completo,
        c.nombre AS categoria_nombre,
        (
          SELECT json_agg(json_build_object('path', i.path))
          FROM imagen i
          WHERE i.anuncio_id = a.id
        ) AS imagenes
      FROM anuncio a
      JOIN usuario u ON u.id = a.usuario_id
      LEFT JOIN categoria c ON c.id = a.categoria_id
      JOIN estado_anuncio ea ON ea.id = a.estado_id
      WHERE ea.nombre = 'Activo'
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener anuncios activos:", error);
    res.status(500).json({ mensaje: "Error al obtener anuncios activos" });
  }
};



const obtenerAnuncioPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT a.*, u.nombre_completo, c.nombre AS categoria_nombre, ea.nombre AS estado_nombre
       FROM anuncio a
       JOIN usuario u ON u.id = a.usuario_id
       LEFT JOIN categoria c ON c.id = a.categoria_id
       LEFT JOIN estado_anuncio ea ON ea.id = a.estado_id
       WHERE a.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Anuncio no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener anuncio por ID:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};



const actualizarAnuncio = async (req, res) => {
  const { id } = req.params;
  const {
    titulo,
    descripcion,
    precio,
    imagenes,
    categoria_id,
    estado_id
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE anuncio SET
        titulo = $1,
        descripcion = $2,
        precio = $3,
        imagenes = $4,
        categoria_id = $5,
        estado_id = $6
      WHERE id = $7
      RETURNING *`,
      [titulo, descripcion, precio, imagenes, categoria_id, estado_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Anuncio no encontrado para actualizar" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar anuncio:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};



module.exports = { 
  crearAnuncio, obtenerAnunciosPorUsuario, 
  cambiarEstadoAnuncio, eliminarAnuncio, obtenerAnunciosDestacados, 
  obtenerAnunciosPublicos, obtenerAnuncioPorId, actualizarAnuncio };
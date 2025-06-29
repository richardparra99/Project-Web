const pool = require('../conexion/db');

const crearAnuncio = async (req, res) => {
  try {
    const { titulo, descripcion, precio, usuario_id, categoria_nombre } = req.body;

    const imagenes = req.files?.map(file => ({
      nombre: file.originalname,
      path: `/uploads/${file.filename}`,
      temporal: false
    })) || [];

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

    const estadoResult = await pool.query('SELECT id FROM estado_anuncio WHERE nombre = $1', ['Activo']);
    const estadoId = estadoResult.rows.length > 0
      ? estadoResult.rows[0].id
      : (await pool.query('INSERT INTO estado_anuncio (nombre) VALUES ($1) RETURNING id', ['Activo'])).rows[0].id;

    const result = await pool.query(
      `INSERT INTO anuncio (titulo, descripcion, precio, usuario_id, categoria_id, estado_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [titulo, descripcion, precio, usuario_id, categoriaId, estadoId]
    );

    const anuncioId = result.rows[0].id;

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
    const actual = await pool.query('SELECT estado_id FROM anuncio WHERE id = $1', [id]);
    const estadoActual = actual.rows[0]?.estado_id;

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
    // Eliminar el anuncio
    await pool.query('DELETE FROM anuncio WHERE id = $1', [id]);

    // Reiniciar la secuencia usando interpolación directa (porque no acepta $1)
    await pool.query(`ALTER SEQUENCE anuncio_id_seq RESTART WITH ${id}`);

    res.status(200).json({ mensaje: `Anuncio ${id} eliminado y secuencia reiniciada desde ${id}` });
  } catch (error) {
    console.error("Error al eliminar anuncio:", error);
    res.status(500).json({ mensaje: 'Error al eliminar anuncio' });
  }
};



const obtenerAnunciosDestacados = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.id, a.titulo, a.descripcion, a.precio
      FROM anuncio a
      INNER JOIN estado_anuncio ea ON a.estado_id = ea.id
      WHERE ea.nombre = 'Activo'
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
  a.usuario_id,
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
    `SELECT a.*, u.nombre_completo, c.nombre AS categoria_nombre, ea.nombre AS estado_nombre,
      (
        SELECT json_agg(json_build_object('id', i.id, 'path', i.path))
        FROM imagen i
        WHERE i.anuncio_id = a.id
      ) AS imagenes
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
    categoria_id,
    estado_id
  } = req.body;

  let imagenesActuales = req.body['imagenes_actuales[]'];
  if (!imagenesActuales) {
    imagenesActuales = [];
  } else if (!Array.isArray(imagenesActuales)) {
    imagenesActuales = [imagenesActuales];
  }

  try {
    await pool.query(
      `UPDATE anuncio SET
        titulo = $1,
        descripcion = $2,
        precio = $3,
        categoria_id = $4,
        estado_id = $5
      WHERE id = $6`,
      [titulo, descripcion, precio, categoria_id, estado_id, id]
    );

    if (imagenesActuales.length > 0) {
      await pool.query(
        `DELETE FROM imagen 
         WHERE anuncio_id = $1 AND id NOT IN (${imagenesActuales.map((_, i) => `$${i + 2}`).join(", ")})`,
        [id, ...imagenesActuales]
      );
    } else {
      await pool.query(
        `DELETE FROM imagen WHERE anuncio_id = $1`,
        [id]
      );
    }

    if (req.files && req.files.length > 0) {
      const insertPromises = req.files.map(file =>
        pool.query(
          `INSERT INTO imagen (nombre, path, temporal, fecha_subida, anuncio_id)
           VALUES ($1, $2, false, CURRENT_TIMESTAMP, $3)`,
          [file.originalname, `/uploads/${file.filename}`, id]
        )
      );
      await Promise.all(insertPromises);
    }

    res.json({ mensaje: 'Anuncio actualizado correctamente' });
  } catch (error) {
    console.error("Error al actualizar anuncio:", error);
    res.status(500).json({ mensaje: "Error del servidor al actualizar el anuncio" });
  }
};


const listarAnunciosPublicos = async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT a.id, a.titulo, a.descripcion, a.precio, a.usuario_id,
             u.nombre_completo,
             c.nombre AS categoria_nombre,
             (
               SELECT json_agg(i.*) FROM imagen i WHERE i.anuncio_id = a.id
             ) AS imagenes
      FROM anuncio a
      JOIN usuario u ON a.usuario_id = u.id
      LEFT JOIN categoria c ON c.id = a.categoria_id
      JOIN estado_anuncio ea ON ea.id = a.estado_id
      WHERE ea.nombre = 'Activo'
    `);
    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al listar anuncios públicos:", error);
    res.status(500).json({ mensaje: "Error al obtener anuncios públicos" });
  }
};


const obtenerAnunciosConInteresados = async (req, res) => {
  const usuarioId = req.params.usuarioId;

  try {
    const anuncios = await pool.query(
      `SELECT a.id, a.titulo, a.descripcion, a.precio, a.usuario_id, u.nombre_completo,
              ARRAY(
                SELECT DISTINCT interesado_id
                FROM conversacion
                WHERE anuncio_id = a.id
              ) AS interesados
       FROM anuncio a
       JOIN usuario u ON a.usuario_id = u.id
       WHERE a.usuario_id = $1`,
      [usuarioId]
    );

    res.json(anuncios.rows);
  } catch (error) {
    console.error("Error al obtener anuncios con interesados:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


const obtenerAnunciosConConversaciones = async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const query = `
      SELECT a.id, a.titulo, a.descripcion, a.precio, 
             COUNT(c.id) AS cantidad_conversaciones,
             COALESCE(i.path, NULL) AS imagen
      FROM anuncio a
      LEFT JOIN conversacion c ON a.id = c.anuncio_id
      LEFT JOIN imagen_anuncio i ON i.anuncio_id = a.id
      WHERE a.usuario_id = $1
      GROUP BY a.id, i.path
      ORDER BY a.id DESC
    `;

    const { rows } = await pool.query(query, [usuarioId]);

    res.json(rows);
  } catch (error) {
    console.error('Error al obtener anuncios con conversaciones:', error);
    res.status(500).json({ error: 'Error interno al obtener los anuncios con conversaciones' });
  }
};

const obtenerAnunciosConChats = async (req, res) => {
  const usuarioId = req.params.usuarioId;

  try {
    const result = await pool.query(`
      SELECT 
        a.*, 
        COALESCE(COUNT(c.id), 0) AS cantidad_chats
      FROM anuncio a
      LEFT JOIN conversacion c ON c.anuncio_id = a.id
      WHERE a.usuario_id = $1
      GROUP BY a.id
      ORDER BY a.id DESC
    `, [usuarioId]);

    // Obtener imágenes por anuncio
    const anuncios = await Promise.all(result.rows.map(async (anuncio) => {
      const imagenes = await pool.query(
        'SELECT path FROM imagen WHERE anuncio_id = $1',
        [anuncio.id]
      );
      return {
        ...anuncio,
        imagenes: imagenes.rows
      };
    }));

    res.json(anuncios);
  } catch (error) {
    console.error("Error en obtenerAnunciosConChats:", error);
    res.status(500).json({ error: "Error al obtener anuncios con chats." });
  }
};




module.exports = { 
  crearAnuncio, obtenerAnunciosPorUsuario, 
  cambiarEstadoAnuncio, eliminarAnuncio, obtenerAnunciosDestacados, 
  obtenerAnunciosPublicos, obtenerAnuncioPorId, actualizarAnuncio,
  listarAnunciosPublicos, obtenerAnunciosConInteresados,
  obtenerAnunciosConConversaciones, 
  obtenerAnunciosConChats};
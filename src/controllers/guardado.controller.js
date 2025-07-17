const pool = require('../conexion/db');

const guardarAnuncio = async (req, res) => {
  try {
    const { usuario_id, anuncio_id } = req.body;

    if (!usuario_id || !anuncio_id) {
      return res.status(400).json({ mensaje: "Faltan datos obligatorios." });
    }

    await pool.query(
      `INSERT INTO anuncio_guardado (usuario_id, anuncio_id)
       VALUES ($1, $2)`,
      [usuario_id, anuncio_id]
    );

    res.status(201).json({ mensaje: "Anuncio guardado exitosamente." });
  } catch (error) {
    console.error("Error al guardar anuncio:", error);
    res.status(500).json({ mensaje: "Error del servidor al guardar anuncio." });
  }
};

const obtenerGuardados = async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const result = await pool.query(`
      SELECT a.*, i.path AS imagen
      FROM anuncio_guardado ag
      JOIN anuncio a ON a.id = ag.anuncio_id
      LEFT JOIN imagen i ON i.anuncio_id = a.id
      WHERE ag.usuario_id = $1
      GROUP BY a.id, i.path
    `, [usuarioId]);

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener guardados:", error);
    res.status(500).json({ mensaje: "Error al obtener guardados" });
  }
};

const eliminarGuardado = async (req, res) => {
  const { usuarioId, anuncioId } = req.params;

  try {
    await pool.query('DELETE FROM anuncio_guardado WHERE usuario_id = $1 AND anuncio_id = $2', [usuarioId, anuncioId]);
    res.status(200).json({ mensaje: 'Anuncio guardado eliminado correctamente.' });
  } catch (error) {
    console.error("Error al eliminar anuncio guardado:", error);
    res.status(500).json({ mensaje: 'Error al eliminar anuncio guardado.' });
  }
};

const obtenerGuardadosPorUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT a.id, a.titulo, a.descripcion, a.precio, i.path AS imagen
      FROM anuncio_guardado ag
      JOIN anuncio a ON a.id = ag.anuncio_id
      LEFT JOIN imagen i ON i.anuncio_id = a.id
      WHERE ag.usuario_id = $1
      GROUP BY a.id, i.path
    `, [id]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener anuncios guardados:", error);
    res.status(500).json({ mensaje: "Error del servidor al obtener anuncios guardados." });
  }
};


const obtenerAnunciosGuardadosPorUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT a.id, a.titulo, a.descripcion, a.precio, i.path AS imagen, u.nombre_completo
      FROM anuncio_guardado ag
      JOIN anuncio a ON ag.anuncio_id = a.id
      LEFT JOIN imagen i ON i.anuncio_id = a.id
      JOIN usuario u ON a.usuario_id = u.id
      WHERE ag.usuario_id = $1
      GROUP BY a.id, i.path, u.nombre_completo
    `, [id]);

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener anuncios guardados:", error);
    res.status(500).json({ mensaje: "Error al obtener anuncios guardados" });
  }
};




module.exports = {
  guardarAnuncio,
  obtenerGuardados,
  eliminarGuardado,
  obtenerGuardadosPorUsuario,
  obtenerAnunciosGuardadosPorUsuario
};

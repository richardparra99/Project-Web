const pool = require("../conexion/db");

const obtenerConversaciones = async (req, res) => {
  try {
    const resultado = await pool.query("SELECT * FROM conversacion");
    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al obtener conversaciones:", error);
    res.status(500).json({ mensaje: "Error al obtener conversaciones" });
  }
};

const iniciarConversacion = async (req, res) => {
  const { anuncio_id, interesado_id, anunciante_id } = req.body;

  // ✅ Validaciones de entrada
  if (!anuncio_id || !interesado_id || !anunciante_id) {
    return res.status(400).json({ mensaje: "Faltan datos para crear la conversación." });
  }

  try {
    // Verificar si ya existe
    const existente = await pool.query(
      `SELECT * FROM conversacion 
       WHERE anuncio_id = $1 AND interesado_id = $2 AND anunciante_id = $3`,
      [anuncio_id, interesado_id, anunciante_id]
    );

    if (existente.rows.length > 0) {
      return res.json(existente.rows[0]); // Ya existe
    }

    // Crear nueva conversación
    const nueva = await pool.query(
      `INSERT INTO conversacion (anuncio_id, interesado_id, anunciante_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [anuncio_id, interesado_id, anunciante_id]
    );

    res.status(201).json(nueva.rows[0]);
  } catch (error) {
    console.error("Error al iniciar conversación:", error);
    res.status(500).json({ mensaje: "Error al iniciar conversación" });
  }
};




const obtenerConversacionesPorAnuncio = async (req, res) => {
  const anuncioId = req.params.anuncioId;

  try {
    const result = await pool.query(`
      SELECT 
        c.id,
        c.anuncio_id,
        c.interesado_id,
        u.nombre_completo AS interesado_nombre,
        (
          SELECT contenido 
          FROM mensaje 
          WHERE conversacion_id = c.id 
          ORDER BY fecha_envio DESC 
          LIMIT 1
        ) AS ultimo_mensaje
      FROM conversacion c
      JOIN usuario u ON u.id = c.interesado_id
      WHERE c.anuncio_id = $1
      ORDER BY c.id DESC
    `, [anuncioId]);

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener conversaciones por anuncio:", error);
    res.status(500).json({ error: "Error al obtener conversaciones." });
  }
};

const obtenerConversacionPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT c.*, 
             u1.nombre_completo AS anunciante_nombre,
             u2.nombre_completo AS interesado_nombre
      FROM conversacion c
      JOIN usuario u1 ON u1.id = c.anunciante_id
      JOIN usuario u2 ON u2.id = c.interesado_id
      WHERE c.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Conversación no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener conversación:', error);
    res.status(500).json({ error: 'Error al obtener la conversación' });
  }
};


const obtenerConversacionesDeCompras = async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const result = await pool.query(`
      SELECT c.id, 
             a.id AS anuncio_id, 
             a.titulo, 
             a.descripcion, 
             a.precio, 
             u.nombre_completo, 
             (SELECT path FROM imagen WHERE anuncio_id = a.id LIMIT 1) AS imagen,
             (SELECT contenido FROM mensaje WHERE conversacion_id = c.id ORDER BY fecha_envio DESC LIMIT 1) AS ultimo_mensaje
      FROM conversacion c
      JOIN anuncio a ON a.id = c.anuncio_id
      JOIN usuario u ON a.usuario_id = u.id
      WHERE c.interesado_id = $1
      ORDER BY c.id DESC
    `, [usuarioId]);

    const conversaciones = result.rows.map(conv => ({
      id: conv.id,
      anuncio: {
        id: conv.anuncio_id,
        titulo: conv.titulo,
        descripcion: conv.descripcion,
        precio: conv.precio,
        nombre_completo: conv.nombre_completo,
        imagenes: conv.imagen ? [{ path: conv.imagen }] : []
      },
      ultimo_mensaje: conv.ultimo_mensaje
    }));

    res.json(conversaciones);
  } catch (error) {
    console.error("Error en obtenerConversacionesDeCompras:", error);
    res.status(500).send("Error al obtener compras.");
  }
};



module.exports = {
  iniciarConversacion, obtenerConversaciones ,
  obtenerConversacionesPorAnuncio, obtenerConversacionPorId, obtenerConversacionesDeCompras
};

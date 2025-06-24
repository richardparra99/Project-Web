const pool = require('../conexion/db');

const enviarMensaje = async (req, res) => {
  const { conversacion_id, emisor_id, receptor_id, contenido } = req.body;

  try {
    await pool.query(
      `INSERT INTO mensaje (conversacion_id, emisor_id, receptor_id, contenido)
       VALUES ($1, $2, $3, $4)`,
      [conversacion_id, emisor_id, receptor_id, contenido]
    );

    res.status(201).json({ mensaje: "Mensaje enviado correctamente." });
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    res.status(500).json({ mensaje: "Error del servidor al enviar mensaje." });
  }
};

const obtenerMensajesPorConversacion = async (req, res) => {
  const { conversacion_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM mensaje WHERE conversacion_id = $1 ORDER BY fecha_envio ASC`,
      [conversacion_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener mensajes:", error);
    res.status(500).json({ mensaje: "Error al obtener mensajes." });
  }
};

module.exports = {
  enviarMensaje,
  obtenerMensajesPorConversacion
};
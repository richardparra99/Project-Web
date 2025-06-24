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





module.exports = {
  iniciarConversacion, obtenerConversaciones
};

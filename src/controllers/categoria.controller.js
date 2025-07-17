const pool = require("../conexion/db");

const crearCategoria = async (req, res) => {
  const { nombre, descripcion } = req.body;

  try {
    const existente = await pool.query(
      'SELECT * FROM categoria WHERE LOWER(nombre) = LOWER($1)',
      [nombre]
    );

    if (existente.rows.length > 0) {
      return res.status(400).json({ mensaje: "La categoría ya existe" });
    }
    
    const resultado = await pool.query(
      `INSERT INTO categoria (nombre, descripcion)
       VALUES ($1, $2)
       RETURNING *`,
      [nombre, descripcion]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al crear categoría:", error);
    res.status(500).json({ mensaje: "Error del servidor al crear la categoría" });
  }
};



const obtenerAnunciosPorCategoria = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await pool.query(`
      SELECT 
        a.id,
        a.titulo,
        a.descripcion,
        a.precio,
        a.usuario_id,
        u.nombre_completo,
        c.nombre AS categoria,
        COALESCE(
          json_agg(json_build_object('id', i.id, 'path', i.path)) 
          FILTER (WHERE i.id IS NOT NULL), '[]'
        ) AS imagenes
      FROM anuncio a
      JOIN usuario u ON a.usuario_id = u.id
      LEFT JOIN imagen i ON i.anuncio_id = a.id
      JOIN categoria c ON a.categoria_id = c.id
      JOIN estado_anuncio ea ON a.estado_id = ea.id
      WHERE a.categoria_id = $1 AND ea.nombre = 'Activo'
      GROUP BY a.id, u.nombre_completo, c.nombre
    `, [id]);

    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al obtener anuncios por categoría:", error);
    res.status(500).json({ mensaje: "Error al obtener anuncios por categoría" });
  }
};

const obtenerCategorias = async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM categoria');
    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({ mensaje: "Error al obtener categorías" });
  }
};

const listarCategorias = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, nombre FROM categoria ORDER BY nombre");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al listar categorías:", error);
    res.status(500).json({ mensaje: "Error al obtener categorías" });
  }
};


const eliminarCategoria = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM categoria WHERE id = $1', [id]);
    res.status(200).json({ mensaje: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    res.status(500).json({ mensaje: 'No se pudo eliminar la categoría' });
  }
};


module.exports = {
  obtenerAnunciosPorCategoria, obtenerCategorias, eliminarCategoria, listarCategorias
};

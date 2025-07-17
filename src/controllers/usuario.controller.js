const pool = require('../conexion/db');

const getUsuarios = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuario');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ mensaje: 'Error al obtener usuarios' });
  }
};


const crearUsuario = async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    await pool.query(
      'INSERT INTO usuario (nombre_completo, email, password) VALUES ($1, $2, $3)',
      [nombre, email, password]
    );
    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ mensaje: 'Error al registrar usuario' });
  }
};


const loginUsuario = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query(
            'SELECT id, nombre_completo FROM usuario WHERE email = $1 AND password = $2',
            [email, password]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
        }

        const usuario = result.rows[0];
        res.status(200).json({
            mensaje: 'Inicio de sesión exitoso',
            id: usuario.id,
            nombre: usuario.nombre_completo
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ mensaje: 'Error del servidor al iniciar sesión' });
    }
};


module.exports = {
  getUsuarios,
  crearUsuario,
  loginUsuario
};

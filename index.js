require('dotenv').config();
const express = require('express');
const app = express();
const pool = require('./conexion/db');

// Importar rutas
const usuarioRoutes = require('./routes/usuario.routes');

app.use(express.json());

// Archivos estáticos (HTML, CSS, imágenes, etc.)
app.use(express.static('public'));

// Usar rutas de usuario
app.use('/usuarios', usuarioRoutes);

// Iniciar servidor
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});

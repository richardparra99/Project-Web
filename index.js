require('dotenv').config();
const express = require('express');
const app = express();
const pool = require('./conexion/db');
const path = require("path");

// Importar rutas
const usuarioRoutes = require('./routes/usuario.routes');
const anuncioRoutes = require('./routes/anuncio.routes');
const imagenRoutes = require('./routes/imagen.routes');
const guardadoRoutes = require('./routes/guardado.routes');

app.use(express.json());

// Archivos estáticos (HTML, CSS, imágenes, etc.)
app.use(express.static('public'));

// Usar rutas de usuario
app.use('/usuarios', usuarioRoutes);
app.use('/anuncios', anuncioRoutes);
app.use('/imagenes', imagenRoutes);
app.use('/guardados', guardadoRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Iniciar servidor
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});

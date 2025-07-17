require('dotenv').config();
const express = require('express');
const app = express();
const pool = require('./conexion/db');
const path = require("path");

const usuarioRoutes = require('./routes/usuario.routes');
const anuncioRoutes = require('./routes/anuncio.routes');
const imagenRoutes = require('./routes/imagen.routes');
const guardadoRoutes = require('./routes/guardado.routes');
const conversacionRoutes = require("./routes/conversacion.routes");
const mensajeRoutes = require('./routes/mensaje.routes');
const categoriaRoutes = require('./routes/categoria.routes');

app.use(express.json());

app.use(express.static('public'));

app.use('/usuarios', usuarioRoutes);
app.use('/anuncios', anuncioRoutes);
app.use('/imagenes', imagenRoutes);
app.use('/guardados', guardadoRoutes);
app.use("/conversaciones", conversacionRoutes);
app.use('/mensajes', mensajeRoutes);
app.use('/categorias', categoriaRoutes);


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});

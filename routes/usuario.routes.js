// routes/usuario.routes.js
const express = require('express');
const router = express.Router();
const { getUsuarios, crearUsuario, loginUsuario} = require('../controllers/usuario.controller');

// Ruta GET /usuarios
router.get('/', getUsuarios);
router.post('/', crearUsuario);
router.post('/login', loginUsuario);

module.exports = router;
    
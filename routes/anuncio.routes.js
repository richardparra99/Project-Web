const express = require('express');
const router = express.Router();
const { 
    crearAnuncio, obtenerAnunciosPorUsuario, 
    cambiarEstadoAnuncio, eliminarAnuncio 
} = require('../controllers/anuncio.controller');

router.post('/', crearAnuncio);
router.get('/usuario/:id', obtenerAnunciosPorUsuario);

router.put('/:id/estado', cambiarEstadoAnuncio);
router.delete('/:id', eliminarAnuncio);


module.exports = router;

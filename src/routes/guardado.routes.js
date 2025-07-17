const express = require('express');
const router = express.Router();
const guardadoController = require('../controllers/guardado.controller');

router.post('/', guardadoController.guardarAnuncio);
router.get('/:usuarioId', guardadoController.obtenerGuardados);
router.delete("/:usuarioId/:anuncioId", guardadoController.eliminarGuardado);
router.get("/usuario/:id", guardadoController.obtenerGuardadosPorUsuario);

router.get("/usuario/:id", guardadoController.obtenerAnunciosGuardadosPorUsuario);

module.exports = router;

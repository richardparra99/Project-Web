const express = require('express');
const router = express.Router();
const mensajeController = require('../controllers/mensaje.controller');


router.post("/", mensajeController.enviarMensaje);
router.get("/:conversacion_id", mensajeController.obtenerMensajesPorConversacion);

module.exports = router;

const express = require("express");
const router = express.Router();
const conversacionController = require("../controllers/conversacion.controller");

router.get("/", conversacionController.obtenerConversaciones);

router.post("/", conversacionController.iniciarConversacion);

router.get("/anuncio/:anuncioId", conversacionController.obtenerConversacionesPorAnuncio);

router.get('/:id', conversacionController.obtenerConversacionPorId); 

module.exports = router;

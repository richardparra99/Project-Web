const express = require("express");
const router = express.Router();
const anuncioController = require("../controllers/anuncio.controller");

// ✅ IMPORTANTE: primero la ruta específica
router.get("/listado", anuncioController.obtenerAnunciosPublicos);

router.post("/", anuncioController.crearAnuncio);
router.get("/usuario/:id", anuncioController.obtenerAnunciosPorUsuario);
router.get("/:id", anuncioController.obtenerAnuncioPorId); // esta va al final
router.put("/:id", anuncioController.actualizarAnuncio);
router.put("/:id/estado", anuncioController.cambiarEstadoAnuncio);
router.delete("/:id", anuncioController.eliminarAnuncio);

module.exports = router;

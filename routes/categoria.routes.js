const express = require("express");
const router = express.Router();
const { obtenerAnunciosPorCategoria, obtenerCategorias, eliminarCategoria
} = require("../controllers/categoria.controller");

//http://localhost:3000/categorias/3/anuncios
router.get("/:id/anuncios", obtenerAnunciosPorCategoria);

router.get("/", obtenerCategorias);
router.delete("/:id", eliminarCategoria);

module.exports = router;

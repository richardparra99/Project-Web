const express = require("express");
const router = express.Router();
const anuncioController = require("../controllers/anuncio.controller");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const tiposPermitidos = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (tiposPermitidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes (.jpg, .jpeg, .png, .webp)"));
    }
  },
});

router.post("/", upload.array("imagenes"), anuncioController.crearAnuncio);

router.get("/listado", anuncioController.obtenerAnunciosPublicos);
router.get("/usuario/:id", anuncioController.obtenerAnunciosPorUsuario);
router.get("/:id", anuncioController.obtenerAnuncioPorId);
router.put("/:id", anuncioController.actualizarAnuncio);
router.put("/:id/estado", anuncioController.cambiarEstadoAnuncio);
router.delete("/:id", anuncioController.eliminarAnuncio);

router.get("/listado", anuncioController.listarAnunciosPublicos);



module.exports = router;

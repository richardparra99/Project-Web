const express = require('express');
const multer = require('multer');
const path = require('path');
const imagenController = require('../controllers/imagen.controller');

const router = express.Router();

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '');
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Subir imágenes (sin anuncio aún, temporalmente)
router.post('/subir', upload.array('imagenes'), imagenController.subirImagenes);

// Asignar imágenes existentes a un anuncio
router.put('/asignar/:anuncioId', imagenController.asignarImagenesAAnuncio);

// Obtener imágenes por anuncio
router.get('/anuncio/:anuncioId', imagenController.obtenerImagenesPorAnuncio);

module.exports = router;

const express = require('express');
const multer = require('multer');
const path = require('path');
const imagenController = require('../controllers/imagen.controller');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '');
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });


router.post('/subir', upload.array('imagenes'), imagenController.subirImagenes);


router.put('/asignar/:anuncioId', imagenController.asignarImagenesAAnuncio);


router.get('/anuncio/:anuncioId', imagenController.obtenerImagenesPorAnuncio);

module.exports = router;

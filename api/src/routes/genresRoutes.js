const express = require('express');
const router = express.Router(); // Crea una instancia de enrutador de Express


const { getGenres } = require('../controllers/genresController');// Importa la función getGenres del controlador de géneros

// Ruta para obtener todos los géneros
router.get('/', getGenres);


module.exports = router;

const express = require('express');
const router = express.Router();
const videogamesController = require('../controllers/videogamesController');

// Ruta para obtener todos los videojuegos
router.get('/', videogamesController.getVideoGames);

// Ruta para obtener un videojuego por su ID
router.get('/:idVideogame', videogamesController.getVideoGameById);

// Ruta para buscar videojuegos por nombre
router.get('/name/:name', videogamesController.searchVideoGamesByName);

// Ruta para crear un nuevo videojuego
router.post('/', videogamesController.createVideoGame);

module.exports = router;

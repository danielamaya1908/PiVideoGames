const express = require('express');
const router = express.Router();// Crea una instancia de enrutador de Express
const videogamesController = require('../controllers/videogamesController');// Importa el controlador de videojuegos

// Ruta para buscar videojuegos por nombre
router.get('/name/:name', videogamesController.searchVideoGamesByName);

// Ruta para obtener todos los videojuegos
router.get('/', videogamesController.getVideoGames);

// Ruta para obtener un videojuego por su ID
router.get('/:idVideogame', videogamesController.getVideoGameById);

// Ruta para crear un nuevo videojuego
router.post('/', videogamesController.createVideoGame);

router.get('/page/:pageNumber', videogamesController.getVideoGames);
router.get('/next/page/:pageNumber', videogamesController.getNextPage);


module.exports = router;

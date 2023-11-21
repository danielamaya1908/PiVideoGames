const express = require('express');
const router = express.Router();
const videogamesController = require('../controllers/videogamesController');

// Ruta para buscar videojuegos por nombre
router.get('/name/:name', videogamesController.searchVideoGamesByName);

// Ruta para obtener todos los videojuegos
router.get('/', videogamesController.getVideoGames);

// Ruta para obtener un videojuego por su ID
// Asegúrate de que esta ruta venga después de rutas más específicas como '/name/:name'
router.get('/:idVideogame', videogamesController.getVideoGameById);

// Ruta para crear un nuevo videojuego
router.post('/', videogamesController.createVideoGame);


module.exports = router;

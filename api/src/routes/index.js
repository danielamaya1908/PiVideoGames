// Importa el módulo Router de Express
const { Router } = require('express');

// Importa los archivos de rutas para los endpoints de videogames y géneros
const videogamesRoutes = require('./videogamesRoutes');
const genresRoutes = require('./genresRoutes');

// Crea una instancia de Router de Express
const router = Router();

// Define las rutas para los endpoints relacionados con los videojuegos y los géneros
router.use('/videogames', videogamesRoutes); // Usa las rutas definidas en videogamesRoutes para /videogames
router.use('/genres', genresRoutes); // Usa las rutas definidas en genresRoutes para /genres

// Exporta el enrutador para que pueda ser utilizado en otras partes de la aplicación
module.exports = router;

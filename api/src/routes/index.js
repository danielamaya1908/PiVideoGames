const { Router } = require('express');
const videogamesRoutes = require('./videogamesRoutes');
const genresRoutes = require('./genresRoutes');

const router = Router();

router.use('/videogames', videogamesRoutes);
router.use('/genres', genresRoutes);

module.exports = router;

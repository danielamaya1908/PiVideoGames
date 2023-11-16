const express = require('express');
const router = express.Router();

const { getGenres } = require('../controllers/genresController');

router.get('/', getGenres);

module.exports = router;

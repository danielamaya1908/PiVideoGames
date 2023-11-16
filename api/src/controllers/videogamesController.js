const axios = require('axios');
require('dotenv').config();
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const RAWG_API_KEY = process.env.RAWG_API_KEY;
const apiUrl = 'https://api.rawg.io/api/games';
const { Genre, Videogame } = require('../db');

const getVideoGames = async (req, res) => {
  try {
    const response = await axios.get(apiUrl, {
      params: {
        key: RAWG_API_KEY,
        page_size: 100
      }
    });
    
    const videoGamesFromAPI = response.data.results.map(game => ({
      ...game,
      origin: 'API' // Establecer el origen como 'API' para los juegos de la API
    }));

    res.json(videoGamesFromAPI);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVideoGameById = async (req, res) => {
  const idVideogame = req.params.idVideogame;

  try {
    const videoGameFromDB = await Videogame.findByPk(idVideogame, {
      include: Genre,
    });

    if (videoGameFromDB) {
      res.json(videoGameFromDB);
    } else {
      // Si no se encuentra en la base de datos, buscar en la API y establecer el origen como 'API'
      const response = await axios.get(`${apiUrl}/${idVideogame}`, {
        params: {
          key: RAWG_API_KEY,
        },
      });

      const videoGameFromAPI = response.data;

      if (!videoGameFromAPI) {
        return res.status(404).json({ message: "Videojuego no encontrado" });
      }

      videoGameFromAPI.origin = 'API'; // Establecer el origen como 'API'
      res.json(videoGameFromAPI);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchVideoGamesByName = async (req, res) => {
  const name = req.params.name;

  try {
    // Buscar en la base de datos
    const videoGamesFromDB = await Videogame.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`
        },
        origin: 'Database' // Filtro para juegos de la base de datos local
      },
      limit: 100
    });

    // Buscar en la API
    const response = await axios.get(apiUrl, {
      params: {
        key: RAWG_API_KEY,
        page_size: 100,
        search: name
      }
    });

    const videoGamesFromAPI = response.data.results.map(game => ({
      ...game,
      origin: 'API' // Establecer el origen como 'API' para los juegos de la API
    }));

    res.json({ results: [...videoGamesFromDB, ...videoGamesFromAPI] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createVideoGame = async (req, res) => {
  console.log(req.body);
  const { name, description, platforms, genres } = req.body;

  try {
    // Verificar que se proporcionen al menos un género
    if (!genres || genres.length === 0) {
      return res.status(400).json({ message: "Se necesita al menos un género." });
    }

    // Crear el videojuego en la base de datos con el campo 'origin' como 'Database'
    const videoGame = await Videogame.create({
      id: uuidv4(), // Genera un nuevo UUID
      name,
      description,
      platforms,
      origin: 'Database', // Establecer el origen como 'Database' para juegos creados localmente
      // Asegúrate de incluir cualquier otro campo que sea necesario
    });

    // Asociar los géneros al videojuego
    await videoGame.addGenres(genres);

    res.json(videoGame);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getVideoGames,
  getVideoGameById,
  searchVideoGamesByName,
  createVideoGame
};

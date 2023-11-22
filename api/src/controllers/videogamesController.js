// Importación de módulos y configuraciones
const axios = require('axios'); // Módulo para hacer solicitudes HTTP
require('dotenv').config(); // Módulo para cargar variables de entorno desde un archivo .env
const { Op } = require('sequelize'); // Operadores de Sequelize para consultas avanzadas
const { v4: uuidv4 } = require('uuid'); // Generador de UUID (Identificadores Únicos Universales)

// Configuración de acceso a la API RAWG
const RAWG_API_KEY = process.env.RAWG_API_KEY; // Obtiene la clave de la API desde variables de entorno
const apiUrl = 'https://api.rawg.io/api/games'; // URL base de la API RAWG para obtener información de videojuegos

// Importación de modelos de la base de datos (Genre y Videogame)
const { Genre, Videogame } = require('../db'); // Importa los modelos de la base de datos definidos en '../db'



const getVideoGames = async (req, res) => {
  try {
    // Obtener juegos de la base de datos local
    const videoGamesFromDB = await Videogame.findAll({
      include: Genre
    });
    const mappedVideoGamesFromDB = videoGamesFromDB.map(game => ({
      ...game.get({ plain: true }),
      origin: 'Database'
    }));

    // Obtener juegos de la API externa
    let videoGamesFromAPI = [];
    const totalPages = 3; // Número de páginas para obtener los 100 juegos (50 por página)
    for (let page = 1; page <= totalPages; page++) {
      const responseAPI = await axios.get(apiUrl, {
        params: {
          key: RAWG_API_KEY,
          page_size: 33, // Número de juegos por página
          page: page
        }
      });
      videoGamesFromAPI = [...videoGamesFromAPI, ...responseAPI.data.results.map(game => ({
        ...game,
        origin: 'API'
      }))];
    }

    // Combinar juegos de la base de datos local y de la API
    const combinedVideoGames = [...mappedVideoGamesFromDB, ...videoGamesFromAPI];
    res.json(combinedVideoGames);
  } catch (error) {
    console.error('Error al obtener los videojuegos:', error);
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
      limit: 500
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
    res.status(500).json({ message: error.message});
  }
};

const createVideoGame = async (req, res) => {
  const { name, description, platforms, genres, background_image, releaseDate, rating } = req.body;

  try {
    // Verificar que se proporcionen al menos un género
    if (!genres || genres.length === 0) {
      return res.status(400).json({ message: "Se necesita al menos un género." });
    }

    // Crear el videojuego en la base de datos con los campos adicionales
    const videoGame = await Videogame.create({
      id: uuidv4(), // Genera un nuevo UUID
      name,
      description,
      platforms,
      background_image, // Asignar la URL de la imagen desde req.body
      releaseDate, // Asignar la fecha de lanzamiento
      rating, // Asignar la calificación
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
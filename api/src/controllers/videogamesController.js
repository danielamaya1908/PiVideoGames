const axios = require('axios');
require('dotenv').config(); 
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid'); 

const RAWG_API_KEY = process.env.RAWG_API_KEY; 
const apiUrl = 'https://api.rawg.io/api/games';

const { Genre, Videogame } = require('../db'); 

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
    const totalPages = 5; 
    const gamesPerPage = 20; 
    const totalGamesDesired = 100; 
    
    for (let page = 1; page <= totalPages; page++) {
      let pageSize = gamesPerPage;
    
      // Si es la última página
      if (page === totalPages) {
        const remainingGames = totalGamesDesired - videoGamesFromAPI.length;
        pageSize = remainingGames; 
      }
    
      const responseAPI = await axios.get(apiUrl, {
        params: {
          key: RAWG_API_KEY,
          page_size: pageSize,
          page: page
        }
      });
    
      videoGamesFromAPI = [...videoGamesFromAPI, ...responseAPI.data.results.map(game => ({
        ...game,
        origin: 'API'
      }))];
    
      // Si ya se alcanzaron los 100 juegos, romper el ciclo
      if (videoGamesFromAPI.length >= totalGamesDesired) {
        break;
      }
    }
    
    // Asegura tener exactamente 100 juegos
    videoGamesFromAPI = videoGamesFromAPI.slice(0, totalGamesDesired);
    

    // Combinar juegos de la base de datos local y de la API
    const combinedVideoGames = [...mappedVideoGamesFromDB, ...videoGamesFromAPI];
    res.json(combinedVideoGames);
  } catch (error) {
    console.error('Error al obtener los videojuegos:', error);
    res.status(500).json({ message: error.message });
  }
};

const getNextPage = async (req, res) => {
  const pageNumber = req.params.pageNumber;

  try {
    // Hacer la solicitud a la API con el número de página especificado
    const responseAPI = await axios.get(apiUrl, {
      params: {
        key: RAWG_API_KEY,
        page_size: gamesPerPage,
        page: pageNumber
      }
    });

    const videoGamesFromAPI = responseAPI.data.results.map(game => ({
      ...game,
      origin: 'API'
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

/* const searchVideoGamesByName = async (req, res) => {
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
      limit: 10
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
 */
const searchVideoGamesByName = async (req, res) => {
  const name = req.params.name;

  try {
    const gamesPerPage = 40; // Juegos por página en la API
    const totalGamesDesired = 100; // Total de juegos deseados
    
    let videoGamesFromAPI = [];
    let currentPage = 1;

    while (videoGamesFromAPI.length < totalGamesDesired) {
      const response = await axios.get(apiUrl, {
        params: {
          key: RAWG_API_KEY,
          page_size: gamesPerPage,
          page: currentPage,
          search: name
        }
      });

      if (response.data.results.length === 0) {
        break; // Si no hay más resultados, salir del bucle
      }

      videoGamesFromAPI = [...videoGamesFromAPI, ...response.data.results.map(game => ({
        ...game,
        origin: 'API'
      }))];

      currentPage++;

      // Si ya se tienen los 100 juegos, romper el ciclo
      if (videoGamesFromAPI.length >= totalGamesDesired) {
        break;
      }
    }

    // Limitar a 100 juegos si se supera
    videoGamesFromAPI = videoGamesFromAPI.slice(0, totalGamesDesired);

    res.json({ results: videoGamesFromAPI });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//crud
const createVideoGame = async (req, res) => {
  const { name, description, platforms, genres, background_image, releaseDate, rating } = req.body;

  try {
    // Verificar que se proporcionen al menos un género
    if (!genres || genres.length === 0) {
      return res.status(400).json({ message: "Se necesita al menos un género." });
    }

    
    const videoGame = await Videogame.create({
      id: uuidv4(), 
      name,
      description,
      platforms,
      background_image, 
      releaseDate, 
      rating, 
      origin: 'Database',
    });

    
    await videoGame.addGenres(genres);

    res.json(videoGame);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* const deleteVideoGame = async (req, res) => {
  const idVideogame = req.params.idVideogame;

  try {
    const deletedGame = await Videogame.destroy({
      where: {
        id: idVideogame,
        origin: 'Database' 
      }
    });

    if (deletedGame === 0) {
      return res.status(404).json({ message: 'No se encontró el videojuego o no es posible eliminarlo' });
    }

    res.json({ message: 'Videojuego eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateVideoGame = async (req, res) => {
  const idVideogame = req.params.idVideogame;
  const updatedData = req.body;

  try {
    const [updatedRowsCount] = await Videogame.update(updatedData, {
      where: {
        id: idVideogame,
        origin: 'Database' // Asegura que solo se actualicen juegos locales
      }
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'No se encontró el videojuego o no es posible actualizarlo' });
    }

    res.json({ message: 'Videojuego actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; */

module.exports = {
  getVideoGames,
  getVideoGameById,
  searchVideoGamesByName,
  createVideoGame,
  getNextPage
};
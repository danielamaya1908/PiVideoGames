const axios = require('axios');
const { Genre } = require('../db');// Importa el modelo Genre desde la base de datos

// URL de la API RAWG para obtener información sobre géneros de videojuegos
const RAWG_API_URL = 'https://api.rawg.io/api/genres?key=207165f07e604ef0b7298e8d2f6ecae8';

const getGenres = async (req, res) => {

  try {
    // 1. Consultar géneros de la API
    const response = await axios.get(RAWG_API_URL);
    const apiGenres = response.data.results;

    // 2. Verificar si ya existen géneros en la DB
    const dbGenres = await Genre.findAll();

    // 3. Si no hay géneros en la DB, guardarlos desde la API
    if(dbGenres.length === 0) {
      await Genre.bulkCreate(apiGenres.map(g => ({
        id: g.id,
        name: g.name
      })));
    }

    // 4. Obtener géneros de la DB
    const genres = await Genre.findAll();

    res.json(genres);

  } catch (error) {
    res.status(500).json({message: error.message});  
  }

}

module.exports = {
  getGenres 
}
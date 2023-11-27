const axios = require('axios');
const { Genre } = require('../db');

const RAWG_API_URL = 'https://api.rawg.io/api/genres?key=207165f07e604ef0b7298e8d2f6ecae8';

const getGenres = async (req, res) => {

  try {
    const response = await axios.get(RAWG_API_URL);
    const apiGenres = response.data.results;

    const dbGenres = await Genre.findAll();

    if(dbGenres.length === 0) {
      await Genre.bulkCreate(apiGenres.map(g => ({
        id: g.id,
        name: g.name
      })));
    }

    const genres = await Genre.findAll();

    res.json(genres);

  } catch (error) {
    res.status(500).json({message: error.message});  
  }

}

module.exports = {
  getGenres 
}
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../../components/Search/SearchBar';
import GameCard from '../../components/GameCard/GameCard';
import FilterOptions from '../../components/FilterOptions/FilterOptions';
import Pagination from '../../components/Pagination/Pagination'; 
import './HomePage.css';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [videoGames, setVideoGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [ setOriginFilter] = useState('all');
  const [sortBy, setSortBy] = useState('none');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 15;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/videogames?_limit=100');
        const gamesWithOrigin = response.data.map(game => ({ ...game }));
        setVideoGames(gamesWithOrigin);
        setFilteredGames(gamesWithOrigin);
      } catch (error) {
        console.error(error);
      }
    };

    fetchInitialData();
  }, []);
  
  // Función para realizar la búsqueda de juegos por nombre
  const handleSearch = async (searchTerm) => {
    try {
      const response = await axios.get(`http://localhost:3001/videogames/name/${searchTerm}`);
      const gamesWithOrigin = response.data.results.map(game => ({ ...game, origin: 'RAWG_API' }));
      setVideoGames(gamesWithOrigin);
      setFilteredGames(gamesWithOrigin);
    } catch (error) {
      console.error(error);
    }
  };

  // Función para filtrar juegos por género
  const handleFilter = (genreId) => {
    let filteredGames = videoGames;
    
    if (genreId) {
      const numericGenreId = Number(genreId);
      filteredGames = filteredGames.filter(game => 
        game.genres && game.genres.some(genre => genre.id === numericGenreId)
      );
    }
  
    return filteredGames;
  };
  
  // Función para filtrar juegos por origen
  const handleOriginFilter = (origin) => {
    let filteredGames = videoGames;
  
    if (origin && origin.toLowerCase() !== 'all') {
      const lowerCaseOrigin = origin.toLowerCase();
      filteredGames = filteredGames.filter(game => 
        game.origin && game.origin.toLowerCase() === lowerCaseOrigin
      );
    }
  
    return filteredGames;
  };
  
  // Función para aplicar filtros combinados por género y origen
  const handleCombinedFilter = (genreId, origin) => {
    // Aplicar el filtro por género
    const filteredByGenre = handleFilter(genreId);
  
    // Aplicar el filtro por origen
    const filteredByOrigin = handleOriginFilter(origin);
  
    // Filtrar los juegos por género y origen
    const combinedFilteredGames = filteredByGenre.filter(game =>
      filteredByOrigin.includes(game)
    );
  
    // Actualizar los juegos filtrados solo si hay algún filtro aplicado
    if (genreId || origin) {
      setFilteredGames(combinedFilteredGames);
    } else {
      // Si no hay filtros aplicados, mostrar todos los juegos
      setFilteredGames(videoGames);
    }
  };
  

  // Función para manejar el ordenamiento de juegos por nombre o rating
  const handleSort = (type) => {
    setSortBy(type);
    let sortedGames = [...filteredGames];
    if (type === 'name') {
      sortedGames.sort((a, b) => a.name.localeCompare(b.name));
    } else if (type === 'rating') {
      sortedGames.sort((a, b) => b.rating - a.rating);
    }
    if (sortDirection === 'desc') {
      sortedGames.reverse();
    }
    setFilteredGames(sortedGames);
  };

  // Función para manejar la dirección del ordenamiento
  const handleSortDirection = (direction) => {
    let sortedGames = [...filteredGames];
    if (sortBy === 'name') {
      sortedGames.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'rating') {
      sortedGames.sort((a, b) => b.rating - a.rating);
    }
    if (direction === 'desc') {
      sortedGames.reverse();
    }
    setFilteredGames(sortedGames);
    setSortDirection(direction);
  };

  // Lógica para la paginación de juegos
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);

  return (
    <div className="home-page">
      <div className="search-bar">
        <SearchBar handleSearch={handleSearch} />
      </div>
      <div className="actions">
        <button className="toggle-filters down-arrow-icon" onClick={() => setShowFilters(!showFilters)}>
          Filters
        </button>
        <button className="toggle-sort down-arrow-icon" onClick={() => setShowSort(!showSort)}>
          Orders
        </button>
      </div>
      {showFilters && (
        <div className="filters">
          <FilterOptions
            handleFilter={handleCombinedFilter}
            handleOriginFilter={setOriginFilter}
          />
        </div>
      )}
      {showSort && (
        <div className="sort">
          <button className="sort-button" onClick={() => handleSort('name')}>Sort by name</button>
          <button className="sort-button" onClick={() => handleSort('rating')}>Sort by rating</button>
          <button className="sort-button" onClick={() => handleSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}>
            {`Sort: ${sortDirection === 'asc' ? 'Asc' : 'Desc'}`}
          </button>
        </div>
      )}
      {/* Botón para crear un nuevo videojuego */}
      <button className='button---'>
        <Link to="/form" className="create-button">Create New Videogame</Link>
      </button>

      {/* Lista de tarjetas de juegos */}
      <div className="card-list">
        {currentGames.map((game, index) => (
          <GameCard key={`${game.id}_${index}`} game={game} />
        ))}
      </div>

      {/* Componente de paginación */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredGames.length / gamesPerPage)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default HomePage;

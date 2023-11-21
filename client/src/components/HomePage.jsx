import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';
import GameCard from './GameCard';
import FilterOptions from './FilterOptions';
import Pagination from './Pagination'; 
import '../styles/HomePage.css';
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
        // Cargar juegos de la API
        const initialResponseAPI = await axios.get('http://localhost:3001/videogames', {
          params: {
            _page: 1, // Página de inicio para la paginación
            _limit: 100, // Cantidad de juegos por página
          }
        });
        const totalGames = initialResponseAPI.headers['x-total-count']; // Total de juegos en la API
        const gamesFromAPI = initialResponseAPI.data.map(game => ({
          ...game,
          origin: 'API'
        }));
  
        let remainingGames = totalGames - 100; // Juegos restantes por obtener
  
        // Si quedan más juegos, realiza las siguientes solicitudes
        if (remainingGames > 0) {
          let currentPage = 2; // Página actual para la siguiente solicitud
  
          while (remainingGames > 0) {
            const nextPageResponse = await axios.get('http://localhost:3001/videogames', {
              params: {
                _page: currentPage,
                _limit: remainingGames > 100 ? 100 : remainingGames, // Limita la cantidad de juegos para la última página
              }
            });
            const nextPageGames = nextPageResponse.data.map(game => ({
              ...game,
              origin: 'API'
            }));
  
            gamesFromAPI.push(...nextPageGames);
            remainingGames -= 100;
            currentPage++;
          }
        }
  
        // Cargar juegos de la base de datos local
        const responseDB = await axios.get('http://localhost:3001/videogames?_limit=1000'); // Ruta para juegos de la base de datos local
        console.log('Juegos de la base de datos local:', responseDB.data);
        const gamesFromDB = responseDB.data.map(game => ({
          ...game,
          origin: 'Database'
        }));
  
        // Identificar juegos duplicados y fusionar las listas
        const combinedGames = gamesFromAPI.concat(
          gamesFromDB.filter(dbGame => !gamesFromAPI.find(apiGame => apiGame.id === dbGame.id))
        );
  
        setVideoGames(combinedGames);
        setFilteredGames(combinedGames);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchInitialData();
  }, []);
  
/*   useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Cargar juegos de la API
        const responseAPI = await axios.get('http://localhost:3001/videogames?_limit=100');
        const gamesFromAPI = responseAPI.data.map(game => ({
          ...game,
          origin: 'API' // Añade el campo 'origin' a los juegos de la API
        }));
  
        // Cargar juegos de la base de datos local
        const responseDB = await axios.get('http://localhost:3001/videogames?_limit=100'); // Ruta para juegos de la base de datos local
        console.log('Juegos de la base de datos local:', responseDB.data);
        const gamesFromDB = responseDB.data.map(game => ({
          ...game,
          origin: 'Database' // Añade el campo 'origin' a los juegos de la base de datos local
        }));
  
        // Identificar juegos duplicados y fusionar las listas
        const combinedGames = gamesFromAPI.concat(
          gamesFromDB.filter(dbGame => !gamesFromAPI.find(apiGame => apiGame.id === dbGame.id))
        );
  
        setVideoGames(combinedGames);
        setFilteredGames(combinedGames);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchInitialData();
  }, []); */
  
  
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

  const handleFilter = (genreId) => {
    let filteredGames = videoGames;
    
    if (genreId) {
      const numericGenreId = Number(genreId);
      filteredGames = filteredGames.filter(game => 
        game.genres && game.genres.some(genre => genre.id === numericGenreId)
      );
    }
  
    console.log('handleFilter - genreId:', genreId, 'filteredGames:', filteredGames);
    return filteredGames;
  };
  
  const handleOriginFilter = (origin) => {
    let filteredGames = videoGames;
  
    if (origin && origin.toLowerCase() !== 'all') {
      const lowerCaseOrigin = origin.toLowerCase();
      filteredGames = filteredGames.filter(game => 
        game.origin && game.origin.toLowerCase() === lowerCaseOrigin
      );
    }
  
    console.log('handleOriginFilter - origin:', origin, 'filteredGames:', filteredGames);
    return filteredGames;
  };
  
  const handleCombinedFilter = (genreId, origin) => {
    console.log('handleCombinedFilter - Starting filter with genreId:', genreId, 'and origin:', origin);
  
    // Aplicar el filtro por género
    const filteredByGenre = handleFilter(genreId);
  
    // Aplicar el filtro por origen
    const filteredByOrigin = handleOriginFilter(origin);
  
    // Filtrar los juegos por género y origen
    const combinedFilteredGames = filteredByGenre.filter(game =>
      filteredByOrigin.includes(game)
    );
  
    console.log('handleCombinedFilter - Combined filteredGames:', combinedFilteredGames);
  
    // Actualizar los juegos filtrados solo si hay algún filtro aplicado
    if (genreId || origin) {
      setFilteredGames(combinedFilteredGames);
    } else {
      // Si no hay filtros aplicados, mostrar todos los juegos
      setFilteredGames(videoGames);
    }
  };
  

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
      <button className='button---'>
        <Link to="/form" className="create-button">Create New Videogame</Link>
      </button>

      <div className="card-list">
  {currentGames.map((game, index) => (
    <GameCard key={`${game.id}_${index}`} game={game} />
  ))}
</div>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredGames.length / gamesPerPage)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default HomePage;

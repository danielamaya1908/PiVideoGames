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
  const [filter, setFilter] = useState('all');
  const [originFilter, setOriginFilter] = useState('all');
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
        const gamesWithOrigin = response.data.map(game => ({ ...game, origin: 'RAWG_API' }));
        setVideoGames(gamesWithOrigin);
        setFilteredGames(gamesWithOrigin);
      } catch (error) {
        console.error(error);
      }
    };

    fetchInitialData();
  }, []);

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

  const handleFilter = (genreId, origin) => {
    let filtered = videoGames;

    if (genreId !== '') {
      filtered = filtered.filter((game) => game.genres.includes(parseInt(genreId)));
    }

    if (origin !== 'all') {
      filtered = filtered.filter((game) => game.origin.toLowerCase() === origin.toLowerCase());
    }

    setFilteredGames(filtered);
  };

  const handleOriginFilter = (origin) => {
    setOriginFilter(origin);
    if (origin === 'all') {
      setFilteredGames(videoGames);
    } else {
      const filtered = videoGames.filter((game) => {
        return game.origin === origin;
      });
      setFilteredGames(filtered);
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
          <FilterOptions handleFilter={handleFilter} handleOriginFilter={handleOriginFilter} />
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
        {currentGames.map((game) => (
          <GameCard key={game.id} game={game} />
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

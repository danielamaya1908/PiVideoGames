import React, { useEffect, useState } from 'react';

const FilterOptions = ({ handleFilter }) => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState('');

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('http://localhost:3001/genres');
        const data = await response.json();
        setGenres(data); 
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreFilter = (value) => {
    setSelectedGenre(value);
    handleFilter(value, selectedOrigin);
  };

  const handleOriginFilter = (value) => {
    setSelectedOrigin(value);
    handleFilter(selectedGenre, value);
  };

  return (
    <div>
      <h3>Filtrar por:</h3>
      <label>
        Género:
        <select value={selectedGenre} onChange={(e) => handleGenreFilter(e.target.value)}>
          <option value="">Todos</option>
          {genres.length > 0 ? (
            genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))
          ) : (
            <option value="">Cargando géneros...</option>
          )}
        </select>
      </label>
      <label>
        Origen:
        <select value={selectedOrigin} onChange={(e) => handleOriginFilter(e.target.value)}>
          <option value="">Todos</option>
          <option value="API">API</option>
          <option value="Database">Base de datos</option>
        </select>
      </label>
    </div>
  );
};

export default FilterOptions;

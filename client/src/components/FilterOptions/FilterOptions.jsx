import React, { useEffect, useState } from 'react';

const FilterOptions = ({ handleFilter }) => {
  // Estados locales para los géneros, género seleccionado y origen seleccionado
  const [genres, setGenres] = useState([]); // Almacena la lista de géneros
  const [selectedGenre, setSelectedGenre] = useState(''); // Almacena el género seleccionado
  const [selectedOrigin, setSelectedOrigin] = useState(''); // Almacena el origen seleccionado

  // Utiliza useEffect para cargar los géneros al montar el componente
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        // Realiza una solicitud para obtener los géneros desde el servidor local
        const response = await fetch('http://localhost:3001/genres');
        const data = await response.json(); // Convierte la respuesta a formato JSON
        setGenres(data); // Actualiza el estado con los géneros obtenidos
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres(); // Llama a la función para obtener los géneros al montar el componente
  }, []);

  // Función para manejar el filtro por género
  const handleGenreFilter = (value) => {
    setSelectedGenre(value); // Actualiza el género seleccionado
    handleFilter(value, selectedOrigin); // Llama a la función handleFilter del componente padre con los valores de género y origen
  };

  // Función para manejar el filtro por origen
  const handleOriginFilter = (value) => {
    setSelectedOrigin(value); // Actualiza el origen seleccionado
    handleFilter(selectedGenre, value); // Llama a la función handleFilter del componente padre con los valores de género y origen
  };

  return (
    <div>
      <h3>Filtrar por:</h3>
      {/* Selector para filtrar por género */}
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
      {/* Selector para filtrar por origen */}
      <label>
        Origen:
        <select value={selectedOrigin} onChange={(e) => handleOriginFilter(e.target.value)}>
          <option value="">Todos</option>
          <option value="api">API</option>
          <option value="database">Base de datos</option>
        </select>
      </label>
    </div>
  );
};

export default FilterOptions;

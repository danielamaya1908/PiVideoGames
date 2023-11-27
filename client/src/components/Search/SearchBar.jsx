import React, { useState } from 'react';

// Componente funcional SearchBar
const SearchBar = ({ handleSearch }) => {
  // Estado local para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Función para manejar la presentación del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Previene la recarga de la página al enviar el formulario
    
    // Validación de caracteres especiales usando una expresión regular
    const specialCharacters = /[!@#$%^&*(),.?":{}|<>]/;
    
    if (specialCharacters.test(searchTerm)) {
      // Muestra una alerta si se detectan caracteres especiales
      alert('No se aceptan caracteres especiales en la búsqueda.');
    } else {
      handleSearch(searchTerm); // Llama a la función handleSearch del componente padre con el término de búsqueda
    }
  };

  // Renderiza el formulario de búsqueda
  return (
    <form onSubmit={handleSubmit}>
      {/* Input para ingresar el término de búsqueda */}
      <input 
        type="text" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el estado con el término de búsqueda ingresado
        placeholder="Search video games by name" // Placeholder en el input
      />
      {/* Botón para realizar la búsqueda */}
      <button className='search' type="submit">Search</button>
    </form>
  );
};

export default SearchBar;

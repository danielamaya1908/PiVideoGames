// Importa React para el uso de componentes
import React from 'react';

// Importa Link de react-router-dom para crear enlaces entre rutas de la aplicación
import { Link } from 'react-router-dom';

const GameCard = ({ game }) => {
  return (
    <div className="game-card">
      {/* Enlace a la ruta específica del videojuego */}
      <Link to={`/videogames/${game.id}`}>
        {/* Imagen del videojuego */}
        <img src={game.background_image} alt={game.name} />
        
        {/* Título del videojuego */}
        <h2>{game.name}</h2>
        
        {/* Muestra los géneros del videojuego si están disponibles */}
        {game.genres && (
          <p>
            {/* Mapea y muestra los nombres de los géneros, separados por comas */}
            {game.genres.map(genre => genre.name).join(', ')}
          </p>
        )}
      </Link>
    </div>
  );
};

export default GameCard;

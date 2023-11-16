import React from 'react';
import { Link } from 'react-router-dom';

const GameCard = ({ game }) => {
  return (
    <div className="game-card">
      <Link to={`/videogames/${game.id}`}>
        <img src={game.background_image} alt={game.name} />
        <h2>{game.name}</h2>
        {game.genres && (
          <p>{game.genres.map(genre => genre.name).join(', ')}</p>
        )}
      </Link>
    </div>
  );
};

export default GameCard;

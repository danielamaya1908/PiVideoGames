import React from 'react';

const VideogameCard = ({ name, image, genres }) => {
  return (
    <div>
      <img src={image} alt={name} />
      <h2>{name}</h2>
      <p>Géneros: {genres.join(', ')}</p>
    </div>
  );
};

export default VideogameCard;

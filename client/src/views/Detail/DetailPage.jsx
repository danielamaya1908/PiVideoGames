import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getGameById } from '../../redux/action';
import './DetailPage.css';

import Loading from '../../components/Loading/Loading'; 

const Detail = () => {
  const { id } = useParams();
  const game = useSelector((state) => state.videoGameDetails);
  const loading = useSelector((state) => state.loading);
  const dispatch = useDispatch();

  // Realiza la llamada a la acción para obtener los detalles del juego
  useEffect(() => {
    dispatch(getGameById(id));
  }, [dispatch, id]);

  // Si se está cargando, muestra el componente de carga
  if (loading) {
    return (
      <div className="detail-container">
        <Loading />
      </div>
    );
  }

  // Si no hay detalles de juego o falta el ID, muestra un mensaje de carga o maneja el estado de no disponible
  if (!game || !game.id) {
    return (
      <div className="detail-container">
        <p>Loading...</p>
      </div>
    );
  }

  // Muestra los detalles del juego, plataformas y géneros
  return (
    <div className="detail-container">
      <h1>ID {game.id} - {game.name}</h1>
      <img className="detail-image" src={game.background_image || game.image} alt={game.name} />
      <div>
        <h2>Released: {game.releaseDate}</h2>
        <h2>Rating: {game.rating}</h2>
        <p dangerouslySetInnerHTML={{ __html: game.description_raw }}></p>

        {/* Muestra las plataformas disponibles */}
        {Array.isArray(game.platforms) ? (
          <div className="platforms">
            <strong>Platforms:</strong>
            <ul>
              {game.platforms.map((platform, index) => <li key={index}>{platform}</li>)}
            </ul>
          </div>
        ) : (
          <div>
            {game.platforms && (
              <div className="platforms">
                <strong>Platforms:</strong>
                <ul>
                  <ul>{game.platforms}</ul>
                </ul>
              </div>
            )}
            {!game.platforms && <div>No platforms available</div>}
          </div>
        )}

        {/* Muestra los géneros disponibles */}
        {Array.isArray(game.genres) ? (
          <div className="genres">
            <strong>Genres:</strong>
            <ul>
              {game.genres.map((genre, index) => (
                <li key={index}>{typeof genre === 'string' ? genre : genre.name}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            {game.genres ? (
              <div>
                {typeof game.genres === 'string' ? (
                  <div className="genres">
                    <strong>Genres:</strong>
                    <ul>
                      <li>{game.genres}</li>
                    </ul>
                  </div>
                ) : (
                  <div>
                    {game.genres.name && (
                      <div className="genres">
                        <strong>Genres:</strong>
                        <ul>
                          <li>{game.genres.name}</li>
                        </ul>
                      </div>
                    )}
                    {!game.genres.name && <div>No genres available</div>}
                  </div>
                )}
              </div>
            ) : (
              <div>No genres available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Detail;

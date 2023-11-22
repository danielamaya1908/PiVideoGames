import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getGameById } from '../../redux/action';
import style from "./DetailPage.css";

const Detail = () => {
  // Obtiene el parámetro de la URL
  const { id } = useParams();

  // Obtiene el estado del juego y el estado de carga del Redux store
  const game = useSelector((state) => state.videoGameDetails);
  const loading = useSelector((state) => state.loading);

  // Permite despachar acciones Redux
  const dispatch = useDispatch();

  // Utiliza useEffect para obtener detalles del juego cuando cambia el ID o se monta el componente
  useEffect(() => {
    dispatch(getGameById(id));
  }, [dispatch, id]);

  // useEffect vacío, se ejecuta cuando cambia el estado del juego

  // Si está cargando, muestra un spinner
  if (loading) {
    return (
      <div className={style.loadercontainer}>
        <div className={style.spinner}></div>
      </div>
    );
  }

  // Si no se encuentra ningún detalle del juego, muestra un mensaje de error
  if (!game) {
    return <p className="error-message">No se encontraron detalles del juego.</p>;
  }

  // Muestra los detalles del juego
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
              <div>
                <strong>Platforms:</strong>
                <ul>
                  <li>{game.platforms}</li>
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

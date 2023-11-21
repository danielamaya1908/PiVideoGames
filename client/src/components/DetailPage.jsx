//// Importa los módulos necesarios
//import React, { useEffect, useState } from "react";
//import { useDispatch, useSelector } from "react-redux";
//import { useParams } from "react-router-dom";
//import { getGameById } from '../actions/action';
//import style from "../styles/DetailPage.css";
//
//// Componente de detalle
//const Detail = () => {
//  // Obtiene el ID de los parámetros de la URL
//  const { id } = useParams();
//
//  // Obtiene el estado del juego del store de Redux
//  const game = useSelector((state) => state.videoGameDetails);
//  const loading = useSelector((state) => state.loading);
//
//  // Configura el despachador de Redux
//  const dispatch = useDispatch();
//
//  // Efecto para cargar los detalles del juego al montar el componente
//  useEffect(() => {
//    dispatch(getGameById(id));
//  }, [dispatch, id]);
//
//  // Muestra un spinner de carga mientras se obtienen los datos
//  if (loading) {
//    return (
//      <div className={style.loadercontainer}>
//        <div className={style.spinner}></div>
//      </div>
//    );
//  }
//
//  // Muestra los detalles del juego cuando la carga ha terminado
//  return (
//    <div className={style.detail}>
//      <div className={style.container}>
//        {game ? (
//          <>
//            <h2 className={style.name}>
//              ID {game.id} - {game.name}
//            </h2>
//            <img className={style.image} src={game.background_image} alt={game.name} />
//            <div className={style.data}>
//              <div className={style.released}>Released: {game.released}</div>
//              <h2 className={style.rating}>Rating: {game.rating}</h2>
//              <div className={style.description} dangerouslySetInnerHTML={{ __html: game.description_raw }}></div>
//              {/* <div className={style.platforms}>
//                Platforms: {game.platforms?.map((platform) => <div key={platform.platform.id}>{platform.platform.name}</div>)}
//              </div> */}
//{/*               <div>
//              Platforms: {game.platforms?.map((platform) => platform.platform ? (<div key={platform.platform.id}>{platform.platform.name}</div>) : (<div>Información de plataforma no disponible</div>))}
//              </div> */}
//              <div>
//  Platforms: {
//    game.platforms?.map((platform, index) => 
//      typeof platform === 'string' ?
//        <div key={index}>{platform}</div> :
//        platform.platform ?
//          <div key={platform.platform.id}>{platform.platform.name}</div> :
//          <div key={index}>Información de plataforma no disponible</div>
//    )
//  }
//</div>
//
//{/*               <div className={style.genres}>
//                Genres: {game.genres?.map((genre) => <div key={genre.id}>{genre.name}</div>)}
//              </div> */}
//              <div className={style.genres}>
//            Genres: {
//              game.genres?.map((genre, index) => 
//                <div key={index}>{genre}</div>
//              )
//            }
//          </div>
//            </div>
//          </>
//        ) : (
//          <p>No se encontraron detalles del juego.</p>
//        )}
//      </div>
//    </div>
//  );
//  };
//export default Detail;
/* import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getGameById } from '../actions/action';
import style from "../styles/DetailPage.css"; // Asegúrate de que este import corresponda a la ubicación de tu archivo CSS

const Detail = () => {
  const { id } = useParams();
  const game = useSelector((state) => state.videoGameDetails);
  const loading = useSelector((state) => state.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGameById(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className={style.loadercontainer}>
        <div className={style.spinner}></div>
      </div>
    );
  }

  if (!game) {
    return <p className="error-message">No se encontraron detalles del juego.</p>;
  }

  return (
    <div className="detail-container">
      <h1>ID {game.id} - {game.name}</h1>
      <img className="detail-image" src={game.image} alt={game.name} />
      <div>
        <h2>Released: {game.releaseDate}</h2>
        <h2>Rating: {game.rating}</h2>
        <p dangerouslySetInnerHTML={{ __html: game.description_raw }}></p>

        <div className="platforms">
          <strong>Platforms:</strong>
          <ul>
            {game.platforms?.map((platform, index) => <li key={index}>{platform}</li>)}
          </ul>
        </div>

        <div className="genres">
          <strong>Genres:</strong>
          <ul>
            {game.genres?.map((genre, index) => <li key={index}>{genre}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Detail; */

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getGameById } from '../actions/action';
import style from "../styles/DetailPage.css"; // Asegúrate de que este import corresponda a la ubicación de tu archivo CSS

const Detail = () => {
  const { id } = useParams();
  const game = useSelector((state) => state.videoGameDetails);
  const loading = useSelector((state) => state.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGameById(id));
  }, [dispatch, id]);

  useEffect(() => {
    console.log("Respuesta de la API:", game); // Agregamos un console.log aquí
  }, [game]);
  
  if (loading) {
    return (
      <div className={style.loadercontainer}>
        <div className={style.spinner}></div>
      </div>
    );
  }

  if (!game) {
    return <p className="error-message">No se encontraron detalles del juego.</p>;
  }

  return (
    <div className="detail-container">
      <h1>ID {game.id} - {game.name}</h1>
      <img className="detail-image" src={game.background_image || game.image} alt={game.name} />
      <div>
        <h2>Released: {game.releaseDate}</h2>
        <h2>Rating: {game.rating}</h2>
        <p dangerouslySetInnerHTML={{ __html: game.description_raw }}></p>

        {/* {<div className="platforms">
          <strong>Platforms:</strong>
          <ul>
            {game.platforms?.map((platform, index) => <li key={index}>{platform}</li>)}
          </ul>
        </div>} */}
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
{
  Array.isArray(game.genres) ? (
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
  )
}


       {/*  {<div className="genres">
          <strong>Genres:</strong>
          <ul>
            {game.genres?.map((genre, index) => <li key={index}>{genre}</li>)}
          </ul>
        </div>} */}
{/* {
  <div className="platforms">
    <strong>Platforms:</strong>
    <ul>
      <li>{game.platforms?.name}</li>
    </ul>
  </div>
}
{
  <div className="genres">
    <strong>Genres:</strong>
    <ul>
      <li>{game.genres?.name}</li>
    </ul>
  </div>
} */}
      </div>
    </div>
  );
};

export default Detail;

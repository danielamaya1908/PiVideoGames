import {
  SET_USER,
  CREATE_VIDEOGAME_SUCCESS,
  CREATE_VIDEOGAME_ERROR,
  FETCH_VIDEO_GAME_DETAILS_SUCCESS,
  FETCH_VIDEO_GAME_DETAILS_ERROR,
} from './action'; // Importa las acciones de Redux

// Estado inicial del store
const initialState = {
  user: null, // Usuario actual
  videoGames: [], // Lista de videojuegos
  successMessage: null, // Mensaje de éxito
  videoGameDetails: null, // Detalles del videojuego
  errorMessage: null, // Mensaje de error
  filter: {
    genres: [], // Lista de géneros para filtros
    selectedGenre: '', // Género seleccionado
    selectedOrigin: '', // Origen seleccionado
  },
};

// Reductor principal que maneja los cambios en el estado de Redux
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      // Actualiza el estado con el usuario
      return {
        ...state,
        user: action.payload,
      };
    case CREATE_VIDEOGAME_SUCCESS:
      // Actualiza el estado con un mensaje de éxito y el nuevo videojuego creado
      return {
        ...state,
        successMessage: 'Videojuego creado con éxito',
        videoGames: [...state.videoGames, action.payload],
      };
    case CREATE_VIDEOGAME_ERROR:
      // Actualiza el estado con un mensaje de error en caso de fallo al crear un videojuego
      return {
        ...state,
        errorMessage: action.payload,
      };
    case FETCH_VIDEO_GAME_DETAILS_SUCCESS:
      // Actualiza el estado con los detalles del videojuego obtenidos con éxito
      return {
        ...state,
        videoGameDetails: action.payload,
        errorMessage: null,
      };
    case FETCH_VIDEO_GAME_DETAILS_ERROR:
      // Actualiza el estado en caso de error al obtener los detalles del videojuego
      return {
        ...state,
        videoGameDetails: null,
        errorMessage: action.payload,
      };
    default:
      return state;
  }
};

export default rootReducer; // Exporta el reductor principal

import {
  SET_USER,
  CREATE_VIDEOGAME_SUCCESS,
  CREATE_VIDEOGAME_ERROR,
  FETCH_VIDEO_GAME_DETAILS_SUCCESS,
  FETCH_VIDEO_GAME_DETAILS_ERROR,
} from './action'; 

const initialState = {
  user: null, 
  videoGames: [], 
  successMessage: null, 
  videoGameDetails: null, 
  errorMessage: null, 
  filter: {
    genres: [], 
    selectedGenre: '', 
    selectedOrigin: '', 
  },
};


const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case CREATE_VIDEOGAME_SUCCESS:
      return {
        ...state,
        successMessage: 'Videojuego creado con éxito',
        videoGames: [...state.videoGames, action.payload],
      };
    case CREATE_VIDEOGAME_ERROR:
      return {
        ...state,
        errorMessage: action.payload,
      };
    case FETCH_VIDEO_GAME_DETAILS_SUCCESS:
      return {
        ...state,
        videoGameDetails: action.payload,
        errorMessage: null,
      };
    case FETCH_VIDEO_GAME_DETAILS_ERROR:
      return {
        ...state,
        videoGameDetails: null,
        errorMessage: action.payload,
      };
    default:
      return state;
  }
};

export default rootReducer;

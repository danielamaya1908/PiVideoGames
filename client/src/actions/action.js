import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

export const SET_USER = 'SET_USER';
export const CREATE_VIDEOGAME_SUCCESS = 'CREATE_VIDEOGAME_SUCCESS';
export const CREATE_VIDEOGAME_ERROR = 'CREATE_VIDEOGAME_ERROR';
export const FETCH_VIDEO_GAME_DETAILS_SUCCESS = 'FETCH_VIDEO_GAME_DETAILS_SUCCESS';
export const FETCH_VIDEO_GAME_DETAILS_ERROR = 'FETCH_VIDEO_GAME_DETAILS_ERROR';
export const SET_FILTER = "SET_FILTER";
export const REMOVE_FILTER = "REMOVE_FILTER";

export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

export const createVideoGameSuccess = (data) => ({
  type: CREATE_VIDEOGAME_SUCCESS,
  payload: data,
});

export const createVideoGameError = (error) => ({
  type: CREATE_VIDEOGAME_ERROR,
  payload: error,
});

export const createVideoGame = (formData) => {
  return async (dispatch) => {
    try {
      formData.id = uuidv4();
      const response = await fetch('http://localhost:3001/videogames', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      dispatch(createVideoGameSuccess(data));
    } catch (error) {
      dispatch(createVideoGameError(error.message));
    }
  };
};

export const fetchVideoGameDetailsSuccess = (data) => ({
  type: FETCH_VIDEO_GAME_DETAILS_SUCCESS,
  payload: data,
});

export const fetchVideoGameDetailsError = (error) => ({
  type: FETCH_VIDEO_GAME_DETAILS_ERROR,
  payload: error,
});

export const fetchVideoGameDetails = (id) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`https://videogames-production-74c6.up.railway.app/videogames/${id}`);
      dispatch(fetchVideoGameDetailsSuccess(response.data));
    } catch (error) {
      dispatch(fetchVideoGameDetailsError('Error fetching video game details.'));
    }
  };
};

export const setFilter = (filter) => ({
  type: SET_FILTER,
  payload: filter,
});

export const removeFilter = () => ({
  type: REMOVE_FILTER,
});

export const getGameById = (id) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`https://videogames-production-74c6.up.railway.app/videogames/${id}`);
      dispatch(fetchVideoGameDetailsSuccess(response.data));
    } catch (error) {
      dispatch(fetchVideoGameDetailsError('Error fetching video game details.'));
    }
  };
};

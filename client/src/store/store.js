// store.js
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/reducer'; // Asegúrate de importar tu rootReducer

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;

import { createStore, applyMiddleware } from 'redux'; // Importa funciones de Redux para crear el store y aplicar middlewares
import thunk from 'redux-thunk'; // Importa redux-thunk para manejar acciones asíncronas en Redux
import rootReducer from './reducer'; // Importa el reductor principal

// Crea el store de Redux con el reductor principal y la aplicación del middleware thunk
const store = createStore(
  rootReducer, // Reductor principal que maneja el estado global
  applyMiddleware(thunk) // Aplica middleware (redux-thunk) para manejar acciones asíncronas
);

export default store; // Exporta el store creado para su uso en la aplicación

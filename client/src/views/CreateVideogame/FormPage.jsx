import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createVideoGame } from '../../redux/action';
import './FormPage.css';
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate de react-router-dom para la navegación programática
import { v4 as uuidv4 } from 'uuid'; // Importa la función v4 de la librería UUID para generar identificadores únicos


const FormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: uuidv4(), // Genera un nuevo UUID para el videojuego
    name: '',
    background_image: '',
    description: '',
    platforms: '',
    releaseDate: '',
    rating: 0,
    genres: [],
  });
  
   // Estado local para almacenar la lista de géneros disponibles
  const [genresList, setGenresList] = useState([]);

  // Estado local para mostrar un mensaje de éxito al crear un videojuego
  const [successMessage, setSuccessMessage] = useState('');

 // Efecto para obtener la lista de géneros disponibles al cargar el componente
 useEffect(() => {
  fetch('http://localhost:3001/genres')
    .then(response => response.json())
    .then(data => setGenresList(data))
    .catch(error => console.error('Error:', error));
}, []);

// Función para manejar cambios en los inputs del formulario
const handleChange = (e) => {
  const { name, value, type } = e.target;

  // Actualiza el estado según el tipo de input (maneja los select múltiples)
  if (type === 'select-multiple') {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({
      ...formData,
      [name]: selectedOptions,
    });
  } else {
    setFormData({
      ...formData,
      [name]: value,
    });
  }
};

// Función para manejar el envío del formulario
const handleSubmit = async (e) => {
  e.preventDefault();
  const formattedFormData = {
    ...formData,
    genres: formData.genres.map(Number),
  };

  try {
    // Envia la información del nuevo videojuego al servidor
    await dispatch(createVideoGame(formattedFormData));
    setSuccessMessage('Videojuego creado con éxito');
    
    // Resetea el formulario para agregar un nuevo videojuego
    setFormData({
      id: uuidv4(), // Genera un nuevo UUID para el próximo videojuego
      name: '',
      background_image: '',
      description: '',
      platforms: '',
      releaseDate: '',
      rating: 0,
      genres: [],
    });

    // Redirige al usuario a la página de inicio después de crear el videojuego
    navigate('/home');
  } catch (error) {
    console.error('Error al crear el videojuego:', error);
  }
};


  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="formu">
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Imagen:</label>
          <input
            type="text"
            name="background_image"
            value={formData.background_image}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Descripción:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Plataformas:</label>
          <input
            type="text"
            name="platforms"
            value={formData.platforms}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Fecha de lanzamiento:</label>
          <input
            type="date"
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Rating:</label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            min="1"
            max="5"
            step="0.1"
            required
          />
        </div>
        <div className="form-group">
          <label>Géneros:</label>
          <select
            name="genres"
            multiple
            value={formData.genres}
            onChange={handleChange}
            required
          >
            {genresList.map(genre => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
        <button className='crear' type="submit">Crear Videojuego</button>
      </form>
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default FormPage;

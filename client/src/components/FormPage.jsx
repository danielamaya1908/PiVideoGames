import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createVideoGame } from '../actions/action';
import '../styles/FormPage.css';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';


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
  
  const [genresList, setGenresList] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/genres')
      .then(response => response.json())
      .then(data => setGenresList(data))
      .catch(error => console.error('Error:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedFormData = {
      ...formData,
      genres: formData.genres.map(Number),
    };
  
    try {
      await dispatch(createVideoGame(formattedFormData));
      setSuccessMessage('Videojuego creado con éxito');
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
      navigate('/home'); // Reemplaza con la ruta correcta
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

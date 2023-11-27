import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createVideoGame } from '../../redux/action';
import './FormPage.css';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const FormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: uuidv4(),
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
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetch('http://localhost:3001/genres')
      .then(response => response.json())
      .then(data => setGenresList(data))
      .catch(error => console.error('Error:', error));
  }, []);

  const validateField = (name, value) => {
    let errors = {};

    switch (name) {
      case 'name':
        if (!value.trim()) {
          errors.name = 'El nombre es requerido';
        } else if (!/^[a-zA-Z0-9 ]+$/.test(value)) {
          errors.name = 'El nombre no debe contener caracteres especiales';
        }
        break;
      case 'background_image':
        if (!value.trim()) {
          errors.background_image = 'La URL de la imagen es requerida';
        }
        break;
      case 'description':
        if (!value.trim()) {
          errors.description = 'La descripción es requerida';
        }
        break;
      case 'platforms':
        if (!value.trim()) {
          errors.platforms = 'Las plataformas son requeridas';
        }
        break;
      case 'releaseDate':
        if (!value) {
          errors.releaseDate = 'La fecha de lanzamiento es requerida';
        } else if (isNaN(Date.parse(value))) {
          errors.releaseDate = 'La fecha de lanzamiento no es válida';
        }
        break;
      case 'rating':
        if (value < 1 || value > 5) {
          errors.rating = 'El rating debe estar entre 1 y 5';
        }
        break;
      case 'genres':
        if (value.length === 0) {
          errors.genres = 'Al menos un género debe ser seleccionado';
        }
        break;
      default:
        break;
    }

    return errors;
  };

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

    const errors = validateField(name, value);
    setFormErrors({
      ...formErrors,
      [name]: errors[name],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = Object.keys(formData).reduce((acc, key) => {
      const fieldErrors = validateField(key, formData[key]);
      return { ...acc, ...fieldErrors };
    }, {});

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      const formattedFormData = {
        ...formData,
        genres: formData.genres.map(Number),
      };

      try {
        await dispatch(createVideoGame(formattedFormData));
        setSuccessMessage('Videojuego creado con éxito');
        
        setFormData({
          id: uuidv4(),
          name: '',
          background_image: '',
          description: '',
          platforms: '',
          releaseDate: '',
          rating: 0,
          genres: [],
        });

        navigate('/home');
      } catch (error) {
        console.error('Error al crear el videojuego:', error);
      }
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
          {formErrors.name && <div className="error-message">{formErrors.name}</div>}
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
          {formErrors.background_image && <div className="error-message">{formErrors.background_image}</div>}
        </div>
        <div className="form-group">
          <label>Descripción:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          {formErrors.description && <div className="error-message">{formErrors.description}</div>}
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
          {formErrors.platforms && <div className="error-message">{formErrors.platforms}</div>}
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
          {formErrors.releaseDate && <div className="error-message">{formErrors.releaseDate}</div>}
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
          {formErrors.rating && <div className="error-message">{formErrors.rating}</div>}
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
          {formErrors.genres && <div className="error-message">{formErrors.genres}</div>}
        </div>
        <button className='crear' type="submit">Crear Videojuego</button>
      </form>
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default FormPage;

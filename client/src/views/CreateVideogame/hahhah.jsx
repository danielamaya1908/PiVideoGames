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

  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

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

    const updatedErrors = { ...errors };
    if (updatedErrors[name]) {
      delete updatedErrors[name];
    }
    setErrors(updatedErrors);

    setTouchedFields({
      ...touchedFields,
      [name]: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
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
  };

  const validateField = (fieldName, value) => {
    const errors = {};

    switch (fieldName) {
      case 'name':
        if (!value.trim()) {
          errors.name = 'El nombre es requerido';
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

  const validateForm = () => {
    const formErrors = {};

    Object.keys(formData).forEach(field => {
      const fieldErrors = validateField(field, formData[field]);
      formErrors[field] = fieldErrors[field];
    });

    setErrors(formErrors);

    return formErrors;
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
            onBlur={() => setTouchedFields({ ...touchedFields, name: true })}
            required
          />
          {touchedFields.name && (!formData.name || errors.name) && (
            <div className="error-message">
              {errors.name ? errors.name : 'El nombre es requerido'}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Imagen:</label>
          <input
            type="text"
            name="background_image"
            value={formData.background_image}
            onChange={handleChange}
            onBlur={() => setTouchedFields({ ...touchedFields, background_image: true })}
            required
          />
          {touchedFields.background_image && (!formData.background_image || errors.background_image) && (
            <div className="error-message">
              {errors.background_image ? errors.background_image : 'La URL de la imagen es requerida'}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Descripción:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            onBlur={() => setTouchedFields({ ...touchedFields, description: true })}
            required
          />
          {touchedFields.description && (!formData.description || errors.description) && (
            <div className="error-message">
              {errors.description ? errors.description : 'La descripción es requerida'}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Plataformas:</label>
          <input
            type="text"
            name="platforms"
            value={formData.platforms}
            onChange={handleChange}
            onBlur={() => setTouchedFields({ ...touchedFields, platforms: true })}
            required
          />
          {touchedFields.platforms && (!formData.platforms || errors.platforms) && (
            <div className="error-message">
              {errors.platforms ? errors.platforms : 'Las plataformas son requeridas'}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Fecha de lanzamiento:</label>
          <input
            type="date"
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleChange}
            onBlur={() => setTouchedFields({ ...touchedFields, releaseDate: true })}
            required
          />
          {touchedFields.releaseDate && (!formData.releaseDate || errors.releaseDate) && (
            <div className="error-message">
              {errors.releaseDate ? errors.releaseDate : 'La fecha de lanzamiento es requerida'}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Rating:</label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            onBlur={() => setTouchedFields({ ...touchedFields, rating: true })}
            min="1"
            max="5"
            step="0.1"
            required
          />
          {touchedFields.rating && ((formData.rating < 1 || formData.rating > 5) || errors.rating) && (
            <div className="error-message">
              {errors.rating ? errors.rating : 'El rating debe estar entre 1 y 5'}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Géneros:</label>
          <select
            name="genres"
            multiple
            value={formData.genres}
            onChange={handleChange}
            onBlur={() => setTouchedFields({ ...touchedFields, genres: true })}
            required
          >
            {genresList.map(genre => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
          {touchedFields.genres && (formData.genres.length === 0 || errors.genres) && (
            <div className="error-message">
              {errors.genres ? errors.genres : 'Al menos un género debe ser seleccionado'}
            </div>
          )}
        </div>
        <button className='crear' type="submit">Crear Videojuego</button>
      </form>
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default FormPage;

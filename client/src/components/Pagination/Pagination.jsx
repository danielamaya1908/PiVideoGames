import React from 'react';
import "./Pagination.css" 

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Función para renderizar los números de página
  const renderPageNumbers = () => {
    const pageNumbers = [];
    // Genera números de página y los agrega a un arreglo
    for (let i = 1; i <= totalPages; i++) {
      // Crea elementos <li> para cada número de página
      pageNumbers.push(
        <li
          key={i}
          className={currentPage === i ? 'active' : ''}
          onClick={() => onPageChange(i)} // Maneja el cambio de página al hacer clic
        >
          {i}
        </li>
      );
    }
    return pageNumbers; // Retorna el arreglo con los números de página
  };

  // Renderiza la estructura del componente de paginación
  return (
    <div className="pagination"> {/* Contenedor principal de la paginación */}
      <ul className="page-numbers"> {/* Lista de números de página */}
        {renderPageNumbers()} {/* Renderiza los números de página */}
      </ul>
    </div>
  );
};

export default Pagination; 

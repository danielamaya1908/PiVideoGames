import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1); // Cambia a la siguiente página si no estamos en la última
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1); // Cambia a la página anterior si no estamos en la primera
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li
          key={i}
          className={currentPage === i ? 'active' : ''}
          onClick={() => onPageChange(i)}
        >
          {i}
        </li>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="pagination">
      <button onClick={handlePrevPage}>{'<'}</button>
      <ul className="page-numbers">
        {renderPageNumbers()}
      </ul>
      <button onClick={handleNextPage}>{'>'}</button>
    </div>
  );
};

export default Pagination;

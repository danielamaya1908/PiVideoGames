import React from 'react';
import "../styles/Pagination.css"

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  console.log(currentPage, totalPages);
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
      <ul className="page-numbers">
        {renderPageNumbers()}
      </ul>
    </div>
  );
};

export default Pagination;

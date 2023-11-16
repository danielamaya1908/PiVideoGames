import React from 'react';

const SortOptions = ({ onSort }) => {
  const handleSort = (option) => {
    onSort(option);
  };

  return (
    <div className="sort-options">
      <button onClick={() => handleSort('Ascendente')}>Ascendente</button>
      <button onClick={() => handleSort('Descendente')}>Descendente</button>
    </div>
  );
};

export default SortOptions;

import React, { useState } from 'react';

const SearchBar = ({ handleSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        placeholder="Search video games by name" 
      />
      <button className='search' type="submit">Search</button>
    </form>
  );
};

export default SearchBar;

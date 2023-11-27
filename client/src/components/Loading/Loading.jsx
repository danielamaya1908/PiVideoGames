import React from 'react';
import './Loading.css'; 

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loader"></div>
      <p>Loading<span className="loading-dots"></span></p>
    </div>
  );
};

export default Loading;

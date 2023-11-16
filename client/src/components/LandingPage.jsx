import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';


const LandingPage = () => {
  return (
    <div className="landing-page">
      <h2>Welcome to Henry Videogames</h2>
      <Link to="/home">
        <button>Get-into</button>
      </Link>
    </div>
  );
};

export default LandingPage;

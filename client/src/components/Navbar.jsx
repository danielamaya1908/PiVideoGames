import React from 'react';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <div className="navbar">
      <ul>
        <li><a href="/">Landing</a></li>
        <li><a href="/home">Home</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </div>
  );
}

export default Navbar;


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './views/Landing/LandingPage';
import HomePage from './views/Home/HomePage';
import Navbar from './components/Navbar/Navbar';
import FormPage from './views/CreateVideogame/FormPage';
import DetailPage from './views/Detail/DetailPage';
import About from './views/About/About';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <LandingPage />
              </>
            }
          />
          <Route
            path="/home"
            element={
              <>
                <Navbar />
                <HomePage />
              </>
            }
          />
          <Route path="/form" element={<FormPage />} />
          <Route path="/videogames/:id" element={<DetailPage />} />
          <Route
            path="/about"
            element={
              <>
                <Navbar />
                <About />
              </>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

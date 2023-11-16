import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import HomePage from './components/HomePage';
import Navbar from './components/Navbar';
import FormPage from './components/FormPage';
import DetailPage from './components/DetailPage';
import About from './components/About';

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

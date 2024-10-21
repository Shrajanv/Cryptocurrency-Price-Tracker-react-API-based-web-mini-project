import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CryptoTable from './CryptoTable'; // Assuming you have a CryptoTable component
import Favorites from './Favorites'; // Assuming you have a Favorites component
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        
        <Routes>
          <Route path="/" element={<CryptoTable />} />
          <Route path="/" element={<CryptoTable />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Category from './pages/User/Category';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <Router>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/category" element={<Category />} />
        </Routes>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Category from './pages/Category';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ServicePage from './pages/Service';
import QueuePage from './pages/Queue';

import Layout from './components/layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/category" element={<Category />} />
          <Route path="/service" element={<ServicePage />} />
          <Route path="/service/:category" element={<ServicePage />} />
          <Route path="/queue" element={<QueuePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

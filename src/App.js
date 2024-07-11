import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import Category from './pages/User/Category';
import Login from './pages/Login';
import Signup from './pages/Signup';

import Layout from './components/layout';

import { checkLogin } from './services';

function App() {
  const [user, setUser] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    (async () => {
      try {
        const user = await checkLogin();
        setUser(user);
        navigate('/category');
      } catch (error) {
        if (location.pathname !== '/login' && location.pathname !== '/signup') {
          navigate('/login');
        }
      }
    })();
  }, [navigate]);

  return (
    <Layout user={user}>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/category" element={<Category />} />
      </Routes>
    </Layout>
  );
}

export default App;

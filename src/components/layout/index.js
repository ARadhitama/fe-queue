import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Navbar from './Navbar';

import { checkLogin } from '../../services';

const AuthContext = createContext();

function Layout({ children }) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    setUser(false);
  };

  const [user, setUser] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) return;

    const authenticateUser = async () => {
      try {
        const user = await checkLogin();
        setUser(user);
        navigate('/category');
      } catch (error) {
        if (location.pathname !== '/login' && location.pathname !== '/signup') {
          navigate('/login');
        }
      }
    };

    authenticateUser();
  }, [navigate, location.pathname]);

  return (
    <AuthContext.Provider value={{ user }}>
      <Navbar user={user} handleLogout={handleLogout} />
      <main className="mx-auto flex min-h-[90vh] max-w-4xl grow">
        {children}
      </main>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default Layout;

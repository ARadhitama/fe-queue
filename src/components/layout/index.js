import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';

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
  const { pathname } = useLocation();

  useEffect(() => {
    if (user) return;

    const authenticateUser = async () => {
      try {
        const user = await checkLogin();
        setUser(user);

        const excludedRoutes = ['/service', '/queue', '/history'];
        if (!excludedRoutes.some((route) => pathname.startsWith(route))) {
          if (user.is_owner) {
            navigate('/service');
          } else {
            navigate('/category');
          }
        }
      } catch (error) {
        if (pathname !== '/login' && pathname !== '/signup') {
          navigate('/login');
        }
      }
    };

    authenticateUser();
  }, [user, navigate, pathname]);

  return (
    <AuthContext.Provider value={{ user }}>
      <Toaster
        position="top-center"
        richColors
        toastOptions={{ duration: 2000 }}
      />
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

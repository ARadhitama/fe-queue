import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar({ user }) {
  const handleClickBtnLogout = async () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navigate = useNavigate();

  return (
    <nav className="bg-gray-800 sticky top-0 z-10 flex h-[10vh] w-full items-center pb-1">
      <div className="flex w-full flex-row items-center justify-between px-10">
        <div className="text-white text-2xl font-bold">Queue</div>
        <div className="text-md flex items-center">
          {user && (
            <>
              <div className="text-white mr-10">
                {user.username} | {user.is_owner ? 'Owner' : 'User'}
              </div>
              <button
                className="text-red-400 text-2xl font-bold"
                onClick={handleClickBtnLogout}
              >
                ➡
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

import React from 'react';
import { Link } from 'react-router-dom';

import { History, Logs, LogOut } from 'lucide-react';

function Navbar({ user, handleLogout }) {
  return (
    <nav className="bg-gray-800 sticky top-0 z-10 flex h-[10vh] w-full items-center pb-1">
      <div className="flex w-full flex-row items-center justify-between px-10">
        <div className="text-white text-2xl font-bold">
          <Link to={user.is_owner ? '/service' : '/category'}>Queue</Link>
        </div>
        <div className="text-md flex items-center">
          {user && (
            <>
              <div className="text-white mr-10">{user.username}</div>
              {!user.is_owner && (
                <>
                  <button className="mr-6 h-5 w-5">
                    <Link to="/history">
                      <History className="text-white h-full w-full" />
                    </Link>
                  </button>
                  <button className="mr-10 h-5 w-5">
                    <Link to="/queue">
                      <Logs className="text-white h-full w-full" />
                    </Link>
                  </button>
                </>
              )}
              <button className="h-5 w-5" onClick={handleLogout}>
                <LogOut className="text-white h-full w-full" />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

import React from 'react';
import Navbar from './Navbar';

function Layout({ user, children }) {
  return (
    <>
      <Navbar user={user} />
      <main className="mx-auto flex min-h-[90vh] max-w-4xl grow">
        {children}
      </main>
    </>
  );
}

export default Layout;

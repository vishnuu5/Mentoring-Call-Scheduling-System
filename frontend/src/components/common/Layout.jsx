import React from 'react';
import { Navbar } from './Navbar.jsx';

export const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
    </div>
  );
};

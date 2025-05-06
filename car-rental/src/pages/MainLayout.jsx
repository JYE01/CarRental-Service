import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar className="z-50" />

      <div className="main-content w-full lg:w-5/6 relative">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
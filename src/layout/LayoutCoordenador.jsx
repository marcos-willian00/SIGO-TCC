import React from 'react';
import SidebarCoordenador from '../components/SidebarCoordenador';

const LayoutCoordenador = ({ children }) => {
  return (
    <div className="flex h-screen">
      <SidebarCoordenador />
      <div className="flex-1 overflow-auto bg-gray-100">
        {children}
      </div>
    </div>
  );
};

export default LayoutCoordenador;

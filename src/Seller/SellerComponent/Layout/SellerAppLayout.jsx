import React from 'react';
import { Outlet } from 'react-router-dom';
import SellerSidebar from '../SellerSidebar';
import SellerMobileNavbar from '../SellerMobileNavbar';
import './SellerAppLayout.css';

const SellerAppLayout = () => {
  return (
    <div className="seller-layout-wrapper">
      {/* Desktop Sidebar */}
      <SellerSidebar />
      
      {/* Main Content */}
      <div className="seller-layout-content">
        <Outlet />
      </div>

      {/* Mobile Bottom Navbar (only visible on mobile) */}
      <SellerMobileNavbar />
    </div>
  );
};

export default SellerAppLayout;
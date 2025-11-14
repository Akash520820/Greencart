import React from 'react';
import { Outlet } from 'react-router-dom';
import SellerSidebar from '../SellerSidebar';
import './SellerAppLayout.css';

const SellerAppLayout = () => {
  return (
    <div className="seller-layout-wrapper">
      <SellerSidebar />
      <div className="seller-layout-content">
        <Outlet />
      </div>
    </div>
  );
};

export default SellerAppLayout;
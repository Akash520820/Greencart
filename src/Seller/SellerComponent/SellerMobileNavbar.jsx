import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import { useProducts } from '../../context/ProductContext';
import { MdDashboard, MdInventory, MdAdd, MdShoppingCart, MdAccountCircle } from 'react-icons/md';
import './SellerMobileNavbar.css';

const SellerMobileNavbar = () => {
  const location = useLocation();
  const { getOrderStats } = useOrders();
  const { products } = useProducts();
  
  // Get pending orders count
  const orderStats = getOrderStats();
  const pendingOrdersCount = orderStats.pendingOrders;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="seller-mobile-navbar">
      <Link 
        to="/seller/dashboard" 
        className={`seller-mobile-nav-item ${isActive('/seller/dashboard') ? 'active' : ''}`}
      >
        <div className="seller-mobile-nav-icon">
          <MdDashboard />
        </div>
        <span className="seller-mobile-nav-label">Dashboard</span>
      </Link>

      <Link 
        to="/seller/inventory" 
        className={`seller-mobile-nav-item ${isActive('/seller/inventory') ? 'active' : ''}`}
      >
        <div className="seller-mobile-nav-icon">
          <MdInventory />
          {products.length > 0 && (
            <span className="seller-mobile-nav-badge">{products.length}</span>
          )}
        </div>
        <span className="seller-mobile-nav-label">Products</span>
      </Link>

      <Link 
        to="/seller/add-product" 
        className="seller-mobile-nav-item seller-mobile-nav-add"
      >
        <div className="seller-mobile-nav-icon-add">
          <MdAdd />
        </div>
      </Link>

      <Link 
        to="/seller/orders" 
        className={`seller-mobile-nav-item ${isActive('/seller/orders') ? 'active' : ''}`}
      >
        <div className="seller-mobile-nav-icon">
          <MdShoppingCart />
          {pendingOrdersCount > 0 && (
            <span className="seller-mobile-nav-badge seller-mobile-nav-badge-warning">
              {pendingOrdersCount}
            </span>
          )}
        </div>
        <span className="seller-mobile-nav-label">Orders</span>
      </Link>

      <Link 
        to="/seller/dashboard" 
        className={`seller-mobile-nav-item ${isActive('/seller/profile') ? 'active' : ''}`}
      >
        <div className="seller-mobile-nav-icon">
          <MdAccountCircle />
        </div>
        <span className="seller-mobile-nav-label">Account</span>
      </Link>
    </nav>
  );
};

export default SellerMobileNavbar;
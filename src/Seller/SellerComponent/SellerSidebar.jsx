import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSellerAuth } from '../../context/SellerAuthContext';
import './SellerSidebar.css';

const SellerSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { seller, sellerLogout } = useSellerAuth();

  const handleLogout = () => {
    sellerLogout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar-container">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-header-icon">
          <i className="bi bi-shop"></i>
        </div>
        <h2 className="sidebar-header-title">Seller Panel</h2>
        <p className="sidebar-header-shop-name">
          {seller?.shopName || 'My Shop'}
        </p>
        <small className="sidebar-header-email">
          {seller?.email || ''}
        </small>
      </div>

      {/* Sidebar Navigation */}
      <nav className="sidebar-nav">
        <Link 
          to="/seller/dashboard" 
          className={`sidebar-nav-link ${isActive('/seller/dashboard') ? 'sidebar-nav-link-active' : ''}`}
        >
          <i className="bi bi-speedometer2 sidebar-nav-icon"></i>
          <span className="sidebar-nav-text">Dashboard</span>
        </Link>
        
        <Link 
          to="/seller/orders" 
          className={`sidebar-nav-link ${isActive('/seller/orders') ? 'sidebar-nav-link-active' : ''}`}
        >
          <i className="bi bi-box-seam sidebar-nav-icon"></i>
          <span className="sidebar-nav-text">Orders</span>
        </Link>
        
        <Link 
          to="/seller/add-product" 
          className={`sidebar-nav-link ${isActive('/seller/add-product') ? 'sidebar-nav-link-active' : ''}`}
        >
          <i className="bi bi-plus-circle sidebar-nav-icon"></i>
          <span className="sidebar-nav-text">Add Product</span>
        </Link>
        
        <Link 
          to="/seller/inventory" 
          className={`sidebar-nav-link ${isActive('/seller/inventory') ? 'sidebar-nav-link-active' : ''}`}
        >
          <i className="bi bi-clipboard-data sidebar-nav-icon"></i>
          <span className="sidebar-nav-text">Inventory</span>
        </Link>
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <button 
          onClick={handleLogout} 
          className="sidebar-logout-btn btn btn-danger w-100"
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default SellerSidebar;
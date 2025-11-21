import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSellerAuth } from '../../context/SellerAuthContext';
import { 
  FiShoppingBag,
  FiGrid,
  FiPackage,
  FiPlusCircle,
  FiClipboard,
  FiLogOut
} from 'react-icons/fi';
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
          <FiShoppingBag />
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
          <FiGrid className="sidebar-nav-icon" />
          <span className="sidebar-nav-text">Dashboard</span>
        </Link>
        
        <Link 
          to="/seller/orders" 
          className={`sidebar-nav-link ${isActive('/seller/orders') ? 'sidebar-nav-link-active' : ''}`}
        >
          <FiPackage className="sidebar-nav-icon" />
          <span className="sidebar-nav-text">Orders</span>
        </Link>
        
        <Link 
          to="/seller/add-product" 
          className={`sidebar-nav-link ${isActive('/seller/add-product') ? 'sidebar-nav-link-active' : ''}`}
        >
          <FiPlusCircle className="sidebar-nav-icon" />
          <span className="sidebar-nav-text">Add Product</span>
        </Link>
        
        <Link 
          to="/seller/inventory" 
          className={`sidebar-nav-link ${isActive('/seller/inventory') ? 'sidebar-nav-link-active' : ''}`}
        >
          <FiClipboard className="sidebar-nav-icon" />
          <span className="sidebar-nav-text">Inventory</span>
        </Link>
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <button 
          onClick={handleLogout} 
          className="sidebar-logout-btn btn btn-danger w-100"
        >
          <FiLogOut style={{ marginRight: '8px' }} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default SellerSidebar;
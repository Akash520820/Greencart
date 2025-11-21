import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSellerAuth } from '../../context/SellerAuthContext';
import { 
  FiShoppingBag,
  FiGrid,
  FiPackage,
  FiPlusCircle,
  FiClipboard,
  FiLogOut,
  FiUser,
  FiMail,
  FiPhone
} from 'react-icons/fi';
import './SellerSidebar.css';

const SellerSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { seller, sellerLogout } = useSellerAuth();
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const popupRef = useRef(null);

  const handleLogout = () => {
    setShowAccountPopup(false);
    sellerLogout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const toggleAccountPopup = () => {
    setShowAccountPopup(!showAccountPopup);
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowAccountPopup(false);
      }
    };

    if (showAccountPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAccountPopup]);

  // Close popup on route change
  useEffect(() => {
    setShowAccountPopup(false);
  }, [location.pathname]);

  return (
    <aside className="sidebar-container">
      {/* Sidebar Header - Clickable for Account Popup */}
      <div 
        className="sidebar-header sidebar-header-clickable"
        onClick={toggleAccountPopup}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && toggleAccountPopup()}
      >
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
        
        {/* Hover hint */}
        <span className="sidebar-header-hint">Click for account options</span>
      </div>

      {/* Account Popup */}
      {showAccountPopup && (
        <>
          <div 
            className="sidebar-popup-overlay" 
            onClick={() => setShowAccountPopup(false)}
          />
          <div className="sidebar-account-popup" ref={popupRef}>
            {/* Popup Header */}
            <div className="sidebar-popup-header">
              <div className="sidebar-popup-avatar">
                {seller?.name?.charAt(0).toUpperCase() || 'S'}
              </div>
              <div className="sidebar-popup-info">
                <h3 className="sidebar-popup-name">{seller?.name || 'Company Admin'}</h3>
                <p className="sidebar-popup-role">Seller Account</p>
              </div>
            </div>

            {/* Popup Details */}
            <div className="sidebar-popup-details">
              <div className="sidebar-popup-detail-item">
                <FiMail className="sidebar-popup-detail-icon" />
                <span>{seller?.email || 'seller@yourcompany.com'}</span>
              </div>
              <div className="sidebar-popup-detail-item">
                <FiUser className="sidebar-popup-detail-icon" />
                <span>{seller?.shopName || 'Your Company Store'}</span>
              </div>
              {seller?.phone && (
                <div className="sidebar-popup-detail-item">
                  <FiPhone className="sidebar-popup-detail-icon" />
                  <span>{seller.phone}</span>
                </div>
              )}
            </div>

            {/* Popup Actions */}
            <div className="sidebar-popup-actions">
              <button 
                className="sidebar-popup-logout-btn"
                onClick={handleLogout}
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </>
      )}

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
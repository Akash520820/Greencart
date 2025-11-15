import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoHome } from "react-icons/io5";
import { AiFillProduct } from "react-icons/ai";
import { BsCartFill } from "react-icons/bs";
import { IoBag } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { useCart } from '../../../context/CartContext';
import { useClientAuth } from '../../../context/ClientAuthContext';
import './BottomNavbar.css';

const BottomNavbar = () => {
  const location = useLocation();
  const { getTotalItems } = useCart();
  const { isAuthenticated, user, logout } = useClientAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dropdownRef = useRef(null);
  const cartCount = getTotalItems();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleUserClick = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <>
      {/* Backdrop */}
      {showUserMenu && (
        <div 
          className={`bottom-navbar-backdrop ${showUserMenu ? 'show' : ''}`}
          onClick={() => setShowUserMenu(false)}
        />
      )}

      <nav className="bottom-navbar">
        <div className="bottom-navbar-container">
          {/* Home */}
          <Link 
            to="/" 
            className={`bottom-navbar-item ${isActive('/') ? 'active' : ''}`}
          >
            <div className="bottom-navbar-icon-wrapper">
              <IoHome className="bottom-navbar-icon" />
            </div>
            <span className="bottom-navbar-label">Home</span>
          </Link>

          {/* All Products */}
          <Link 
            to="/AllProduct" 
            className={`bottom-navbar-item ${isActive('/AllProduct') ? 'active' : ''}`}
          >
            <div className="bottom-navbar-icon-wrapper">
              <AiFillProduct className="bottom-navbar-icon" />
            </div>
            <span className="bottom-navbar-label">Products</span>
          </Link>

          {/* Cart (Center - Featured) */}
          <Link 
            to="/cart" 
            className={`bottom-navbar-item ${isActive('/cart') ? 'active' : ''}`}
          >
            <div className="bottom-navbar-icon-wrapper">
              <BsCartFill className="bottom-navbar-icon" />
              {cartCount > 0 && (
                <span className="bottom-navbar-cart-badge">{cartCount}</span>
              )}
            </div>
            <span className="bottom-navbar-label">Cart</span>
          </Link>

          {/* My Orders (Show only if authenticated) */}
          {isAuthenticated ? (
            <Link 
              to="/my-orders" 
              className={`bottom-navbar-item ${isActive('/my-orders') ? 'active' : ''}`}
            >
              <div className="bottom-navbar-icon-wrapper">
                <IoBag className="bottom-navbar-icon" />
              </div>
              <span className="bottom-navbar-label">Orders</span>
            </Link>
          ) : (
            <Link 
              to="/Contact" 
              className={`bottom-navbar-item ${isActive('/Contact') ? 'active' : ''}`}
            >
              <div className="bottom-navbar-icon-wrapper">
                <svg 
                  className="bottom-navbar-icon" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
              <span className="bottom-navbar-label">Contact</span>
            </Link>
          )}

          {/* Account / User */}
          <div className="bottom-navbar-user-dropdown" ref={dropdownRef}>
            <button 
              className={`bottom-navbar-item ${showUserMenu ? 'active' : ''}`}
              onClick={handleUserClick}
            >
              <div className="bottom-navbar-icon-wrapper">
                <MdAccountCircle className="bottom-navbar-icon" />
              </div>
              <span className="bottom-navbar-label">
                {isAuthenticated ? 'Account' : 'Login'}
              </span>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && isAuthenticated && (
              <div className={`bottom-navbar-user-menu ${showUserMenu ? 'show' : ''}`}>
                <div className="bottom-navbar-user-header">
                  <div className="bottom-navbar-user-info">
                    <div className="bottom-navbar-user-avatar">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="bottom-navbar-user-details">
                      <p className="bottom-navbar-user-name">{user?.name || 'User'}</p>
                      <p className="bottom-navbar-user-email">{user?.email || ''}</p>
                    </div>
                  </div>
                </div>
                
                <button 
                  className="bottom-navbar-menu-item bottom-navbar-logout-btn"
                  onClick={handleLogout}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default BottomNavbar;
import React, { useState } from "react";
import { assets } from "../../../assets/assets";
import { Link, useLocation } from "react-router-dom";
import CartBadge from "./CartBadge";
import AuthModal from "../LogInSignIn/AuthModal";
import UserAccountDropdown from "./UserAccountDropdown";
import { useClientAuth } from "../../../context/ClientAuthContext";
import "./Navbar.css";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated, user } = useClientAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLoginClick = () => {
    setShowAuthModal(true);
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm navbar-container">
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img src={assets.logo} alt="logo" className="navbar-logo" />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link 
                  className={`nav-link navbar-link ${isActive('/') ? 'active' : ''}`} 
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link navbar-link ${isActive('/AllProduct') ? 'active' : ''}`} 
                  to="/AllProduct"
                >
                  All Product
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link navbar-link ${isActive('/Contact') ? 'active' : ''}`} 
                  to="/Contact"
                >
                  Contact
                </Link>
              </li>
              {/* My Orders - Only visible on mobile when authenticated */}
              <li className="nav-item d-lg-none">
                {isAuthenticated && (
                  <Link 
                    className={`nav-link navbar-link ${isActive('/my-orders') ? 'active' : ''}`} 
                    to="/my-orders"
                  >
                    My Orders
                  </Link>
                )}
              </li>
            </ul>

            <div className="navbar-actions ms-lg-4">
              <SearchBar />

              {/* Desktop Cart and Auth */}
              <div className="navbar-desktop-cart-login">
                <CartBadge />
                {isAuthenticated ? (
                  <UserAccountDropdown />
                ) : (
                  <button 
                    type="button" 
                    className="btn btn-success navbar-login-btn px-4" 
                    style={{borderRadius:"20px"}}
                    onClick={handleLoginClick}
                  >
                    Login
                  </button>
                )}
              </div>

              {/* Mobile User Display and Auth */}
              <div className="navbar-mobile-cart-login">
                {isAuthenticated ? (
                  <>
                    <div className="navbar-mobile-user-display">
                      <span className="navbar-user-text">User</span>
                      <UserAccountDropdown isMobile={true} />
                    </div>
                  </>
                ) : (
                  <button 
                    type="button" 
                    className="btn  navbar-login-btn w-100" 
                    style={{borderRadius:"20px"}}
                    onClick={handleLoginClick}
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal show={showAuthModal} onClose={handleCloseModal} />
    </>
  );
};

export default Navbar;
import React, { createContext, useState, useContext, useEffect } from 'react';

const SellerAuthContext = createContext();

// HARDCODED SELLER CREDENTIALS - Your company's single seller account
const HARDCODED_SELLER = {
  email: 'seller@yourcompany.com',
  password: 'Seller@123',  // Change this to your desired password
  id: 'seller_001',
  name: 'Company Admin',
  role: 'seller',
  shopName: 'Your Company Store',
  phone: '+1 234 567 8900'
};

export const SellerAuthProvider = ({ children }) => {
  const [isSellerAuthenticated, setIsSellerAuthenticated] = useState(false);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if seller is already logged in (from localStorage)
  useEffect(() => {
    const savedSeller = localStorage.getItem('seller');
    const savedToken = localStorage.getItem('sellerToken');
    
    if (savedSeller && savedToken) {
      const parsedSeller = JSON.parse(savedSeller);
      // Verify it's the correct seller
      if (parsedSeller.id === HARDCODED_SELLER.id) {
        setSeller(parsedSeller);
        setIsSellerAuthenticated(true);
      } else {
        // Invalid seller, clear storage
        localStorage.removeItem('seller');
        localStorage.removeItem('sellerToken');
      }
    }
    setLoading(false);
  }, []);

  // Seller Login with hardcoded credentials
  const sellerLogin = async (email, password) => {
    try {
      // Validate against hardcoded credentials
      if (email === HARDCODED_SELLER.email && password === HARDCODED_SELLER.password) {
        const sellerData = {
          id: HARDCODED_SELLER.id,
          name: HARDCODED_SELLER.name,
          email: HARDCODED_SELLER.email,
          role: HARDCODED_SELLER.role,
          shopName: HARDCODED_SELLER.shopName,
          phone: HARDCODED_SELLER.phone
        };

        const token = `seller_token_${Date.now()}`;

        // Save to state
        setSeller(sellerData);
        setIsSellerAuthenticated(true);

        // Save to localStorage
        localStorage.setItem('seller', JSON.stringify(sellerData));
        localStorage.setItem('sellerToken', token);

        return { success: true, seller: sellerData };
      } else {
        return { 
          success: false, 
          error: 'Invalid credentials. Please check your email and password.' 
        };
      }
    } catch (error) {
      console.error('Seller login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  // Seller Signup - Disabled (only one seller account allowed)
  const sellerSignup = async () => {
    return { 
      success: false, 
      error: 'Signup is disabled. Please contact the administrator for access.' 
    };
  };

  // Seller Logout
  const sellerLogout = () => {
    setSeller(null);
    setIsSellerAuthenticated(false);
    localStorage.removeItem('seller');
    localStorage.removeItem('sellerToken');
  };

  // Update Seller Profile
  const updateSellerProfile = (updatedData) => {
    // Only allow updating certain fields, not credentials
    const updatedSeller = { 
      ...seller, 
      name: updatedData.name || seller.name,
      shopName: updatedData.shopName || seller.shopName,
      phone: updatedData.phone || seller.phone
    };
    setSeller(updatedSeller);
    localStorage.setItem('seller', JSON.stringify(updatedSeller));
  };

  const value = {
    isSellerAuthenticated,
    seller,
    loading,
    sellerLogin,
    sellerSignup,
    sellerLogout,
    updateSellerProfile,
    HARDCODED_CREDENTIALS: { 
      email: HARDCODED_SELLER.email,
      // Don't expose password in production
    }
  };

  return (
    <SellerAuthContext.Provider value={value}>
      {!loading && children}
    </SellerAuthContext.Provider>
  );
};

// Custom hook to use SellerAuth
export const useSellerAuth = () => {
  const context = useContext(SellerAuthContext);
  if (!context) {
    throw new Error('useSellerAuth must be used within SellerAuthProvider');
  }
  return context;
};

export default SellerAuthContext;
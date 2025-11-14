import React, { createContext, useState, useContext, useEffect } from 'react';

const SellerAuthContext = createContext();

export const SellerAuthProvider = ({ children }) => {
  const [isSellerAuthenticated, setIsSellerAuthenticated] = useState(false);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if seller is already logged in (from localStorage)
  useEffect(() => {
    const savedSeller = localStorage.getItem('seller');
    const savedToken = localStorage.getItem('sellerToken');
    
    if (savedSeller && savedToken) {
      setSeller(JSON.parse(savedSeller));
      setIsSellerAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Seller Login
  const sellerLogin = async (email, password) => {
    try {
      // TODO: Replace with your actual API call
      // const response = await fetch('/api/seller/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // const data = await response.json();

      // TEMPORARY: Mock seller data for testing
      const mockSeller = {
        id: '123',
        name: 'Seller Name',
        email: email,
        role: 'seller',
        shopName: 'My Shop',
        phone: '+91 1234567890'
      };

      const mockToken = 'mock-seller-token-12345';

      // Save to state
      setSeller(mockSeller);
      setIsSellerAuthenticated(true);

      // Save to localStorage
      localStorage.setItem('seller', JSON.stringify(mockSeller));
      localStorage.setItem('sellerToken', mockToken);

      return { success: true, seller: mockSeller };
    } catch (error) {
      console.error('Seller login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  // Seller Signup
  const sellerSignup = async (name, email, password, shopName, phone) => {
    try {
      // TODO: Replace with your actual API call
      // const response = await fetch('/api/seller/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, password, shopName, phone })
      // });
      // const data = await response.json();

      // TEMPORARY: Mock seller data for testing
      const mockSeller = {
        id: '123',
        name: name,
        email: email,
        role: 'seller',
        shopName: shopName,
        phone: phone
      };

      const mockToken = 'mock-seller-token-12345';

      // Save to state
      setSeller(mockSeller);
      setIsSellerAuthenticated(true);

      // Save to localStorage
      localStorage.setItem('seller', JSON.stringify(mockSeller));
      localStorage.setItem('sellerToken', mockToken);

      return { success: true, seller: mockSeller };
    } catch (error) {
      console.error('Seller signup error:', error);
      return { success: false, error: 'Signup failed' };
    }
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
    const updatedSeller = { ...seller, ...updatedData };
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
    updateSellerProfile
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
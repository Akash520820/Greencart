// ProductContext.jsx - FIXED VERSION
import React, { createContext, useContext, useState, useEffect } from 'react';
import { dummyProducts } from '../assets/assets';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 👈 FIXED: Better initialization with proper loading state
  useEffect(() => {
    const initializeProducts = () => {
      try {
        const savedProducts = localStorage.getItem('allProducts');
        
        if (savedProducts) {
          const parsedProducts = JSON.parse(savedProducts);
          setProducts(parsedProducts);
          console.log('Products loaded from localStorage:', parsedProducts.length); // Debug log
        } else {
          // First time - initialize with dummy data
          setProducts(dummyProducts);
          localStorage.setItem('allProducts', JSON.stringify(dummyProducts));
          console.log('Initialized with dummy products:', dummyProducts.length); // Debug log
        }
      } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to dummy products on error
        setProducts(dummyProducts);
        try {
          localStorage.setItem('allProducts', JSON.stringify(dummyProducts));
        } catch (e) {
          console.error('Failed to save dummy products:', e);
        }
      } finally {
        setLoading(false); // 👈 Always set loading to false
      }
    };

    initializeProducts();
  }, []); // Only run once on mount

  // 👈 FIXED: Save to localStorage whenever products change (but only after initial load)
  useEffect(() => {
    if (!loading && products.length > 0) {
      try {
        localStorage.setItem('allProducts', JSON.stringify(products));
        console.log('Products saved to localStorage:', products.length); // Debug log
      } catch (error) {
        console.error('Error saving products:', error);
      }
    }
  }, [products, loading]);

  // Helper function to safely save to localStorage
  const safeLocalStorageSave = (key, data) => {
    try {
      const jsonString = JSON.stringify(data);
      localStorage.setItem(key, jsonString);
      return { success: true };
    } catch (error) {
      console.error('localStorage save error:', error);
      
      if (error.name === 'QuotaExceededError') {
        return { 
          success: false, 
          error: 'Storage quota exceeded. Please delete old products or reduce image sizes.' 
        };
      }
      
      return { 
        success: false, 
        error: 'Failed to save product. Please try again.' 
      };
    }
  };

  // Seller: Add new product
  const addProduct = (productData) => {
    const newProduct = {
      _id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: productData.name,
      category: productData.category,
      price: parseFloat(productData.price),
      offerPrice: productData.offerPrice ? parseFloat(productData.offerPrice) : null,
      image: productData.images || [],
      description: productData.description ? [productData.description] : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      inStock: true,
      sellerId: productData.sellerId || 'default-seller'
    };

    setProducts(prevProducts => {
      const updatedProducts = [...prevProducts, newProduct];
      
      // Try to save to localStorage
      const saveResult = safeLocalStorageSave('allProducts', updatedProducts);
      
      if (!saveResult.success) {
        // If save failed, throw error to be caught by calling component
        const error = new Error(saveResult.error);
        error.name = 'QuotaExceededError';
        throw error;
      }
      
      // Trigger event for real-time updates
      window.dispatchEvent(new Event('productsUpdated'));
      
      return updatedProducts;
    });

    return newProduct;
  };

  // Seller: Update product
  const updateProduct = (productId, updates) => {
    setProducts(prevProducts => {
      const updatedProducts = prevProducts.map(product =>
        product._id === productId
          ? { 
              ...product, 
              ...updates, 
              updatedAt: new Date().toISOString() 
            }
          : product
      );

      const saveResult = safeLocalStorageSave('allProducts', updatedProducts);
      
      if (!saveResult.success) {
        throw new Error(saveResult.error);
      }
      
      window.dispatchEvent(new Event('productsUpdated'));
      
      return updatedProducts;
    });
  };

  // Seller: Delete product
  const deleteProduct = (productId) => {
    setProducts(prevProducts => {
      const updatedProducts = prevProducts.filter(product => product._id !== productId);
      
      const saveResult = safeLocalStorageSave('allProducts', updatedProducts);
      
      if (!saveResult.success) {
        throw new Error(saveResult.error);
      }
      
      window.dispatchEvent(new Event('productsUpdated'));
      
      return updatedProducts;
    });
  };

  // Seller: Toggle stock status
  const toggleStock = (productId) => {
    setProducts(prevProducts => {
      const updatedProducts = prevProducts.map(product =>
        product._id === productId
          ? { 
              ...product, 
              inStock: !product.inStock,
              updatedAt: new Date().toISOString()
            }
          : product
      );

      const saveResult = safeLocalStorageSave('allProducts', updatedProducts);
      
      if (!saveResult.success) {
        throw new Error(saveResult.error);
      }
      
      window.dispatchEvent(new Event('productsUpdated'));
      
      return updatedProducts;
    });
  };

  // Client: Get all products (only in stock)
  const getAvailableProducts = () => {
    return products.filter(product => product.inStock);
  };

  // Get products by category
  const getProductsByCategory = (category) => {
    if (category === 'All') return products.filter(p => p.inStock);
    return products.filter(product => 
      product.category === category && product.inStock
    );
  };

  // Get product by ID
  const getProductById = (productId) => {
    return products.find(product => product._id === productId);
  };

  // Search products
  const searchProducts = (searchTerm) => {
    if (!searchTerm) return products.filter(p => p.inStock);
    const term = searchTerm.toLowerCase();
    return products.filter(product =>
      product.inStock && (
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      )
    );
  };

  // Get all unique categories
  const getAllCategories = () => {
    const categories = [...new Set(products.map(product => product.category))];
    return ['All', ...categories];
  };

  // Seller: Get seller's products stats
  const getSellerStats = (sellerId = 'default-seller') => {
    const sellerProducts = products.filter(p => p.sellerId === sellerId);
    return {
      totalProducts: sellerProducts.length,
      inStock: sellerProducts.filter(p => p.inStock).length,
      outOfStock: sellerProducts.filter(p => !p.inStock).length
    };
  };

  // Get storage usage info
  const getStorageInfo = () => {
    try {
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += (localStorage[key].length + key.length) * 2; // UTF-16
        }
      }
      const usedMB = (total / (1024 * 1024)).toFixed(2);
      const limitMB = 5; // Most browsers ~5-10MB
      const percentUsed = ((total / (limitMB * 1024 * 1024)) * 100).toFixed(1);
      
      return {
        usedMB,
        limitMB,
        percentUsed
      };
    } catch (e) {
      return null;
    }
  };

  // 👈 FIXED: Listen for storage changes (sync across tabs)
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Only reload if allProducts changed
      if (e.key === 'allProducts' || e.type === 'productsUpdated') {
        const savedProducts = localStorage.getItem('allProducts');
        if (savedProducts) {
          try {
            const parsedProducts = JSON.parse(savedProducts);
            setProducts(parsedProducts);
            console.log('Products reloaded from storage event:', parsedProducts.length); // Debug log
          } catch (error) {
            console.error('Error parsing products from storage event:', error);
          }
        }
      }
    };

    window.addEventListener('productsUpdated', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('productsUpdated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const value = {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleStock,
    getAvailableProducts,
    getProductsByCategory,
    getProductById,
    searchProducts,
    getAllCategories,
    getSellerStats,
    getStorageInfo
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
};

export default ProductContext;
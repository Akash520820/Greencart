// ProductContext.jsx - FIXED VERSION (No Duplicate Products)
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { dummyProducts } from '../assets/assets';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const isInitialized = useRef(false); // Prevent double initialization

  // Initialize products ONCE
  useEffect(() => {
    if (isInitialized.current) return; // Already initialized
    isInitialized.current = true;

    const initializeProducts = () => {
      try {
        const savedProducts = localStorage.getItem('allProducts');
        
        if (savedProducts) {
          const parsedProducts = JSON.parse(savedProducts);
          // Remove duplicates by _id
          const uniqueProducts = parsedProducts.filter((product, index, self) =>
            index === self.findIndex(p => p._id === product._id)
          );
          setProducts(uniqueProducts);
          // Save cleaned data back
          if (uniqueProducts.length !== parsedProducts.length) {
            localStorage.setItem('allProducts', JSON.stringify(uniqueProducts));
          }
          console.log('Products loaded:', uniqueProducts.length);
        } else {
          // First time - initialize with dummy data
          const uniqueDummy = dummyProducts.filter((product, index, self) =>
            index === self.findIndex(p => p._id === product._id)
          );
          setProducts(uniqueDummy);
          localStorage.setItem('allProducts', JSON.stringify(uniqueDummy));
          console.log('Initialized with dummy products:', uniqueDummy.length);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts(dummyProducts);
        localStorage.setItem('allProducts', JSON.stringify(dummyProducts));
      } finally {
        setLoading(false);
      }
    };

    initializeProducts();
  }, []);

  // Save to localStorage when products change (after init)
  useEffect(() => {
    if (!loading && products.length > 0) {
      localStorage.setItem('allProducts', JSON.stringify(products));
    }
  }, [products, loading]);

  // Add new product - FIXED to prevent duplicates
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
      // Check if product already exists (prevent duplicates)
      if (prevProducts.some(p => p._id === newProduct._id)) {
        console.warn('Product already exists, skipping...');
        return prevProducts;
      }
      
      const updatedProducts = [...prevProducts, newProduct];
      
      // Save immediately to localStorage
      try {
        localStorage.setItem('allProducts', JSON.stringify(updatedProducts));
        window.dispatchEvent(new Event('productsUpdated'));
      } catch (error) {
        console.error('Error saving product:', error);
        throw error;
      }
      
      return updatedProducts;
    });

    return newProduct;
  };

  // Update product
  const updateProduct = (productId, updates) => {
    setProducts(prevProducts => {
      const updatedProducts = prevProducts.map(product =>
        product._id === productId
          ? { ...product, ...updates, updatedAt: new Date().toISOString() }
          : product
      );
      localStorage.setItem('allProducts', JSON.stringify(updatedProducts));
      window.dispatchEvent(new Event('productsUpdated'));
      return updatedProducts;
    });
  };

  // Delete product
  const deleteProduct = (productId) => {
    setProducts(prevProducts => {
      const updatedProducts = prevProducts.filter(p => p._id !== productId);
      localStorage.setItem('allProducts', JSON.stringify(updatedProducts));
      window.dispatchEvent(new Event('productsUpdated'));
      return updatedProducts;
    });
  };

  // Toggle stock status
  const toggleStock = (productId) => {
    setProducts(prevProducts => {
      const updatedProducts = prevProducts.map(product =>
        product._id === productId
          ? { ...product, inStock: !product.inStock, updatedAt: new Date().toISOString() }
          : product
      );
      localStorage.setItem('allProducts', JSON.stringify(updatedProducts));
      window.dispatchEvent(new Event('productsUpdated'));
      return updatedProducts;
    });
  };

  // Get all available products (in stock only)
  const getAvailableProducts = () => products.filter(p => p.inStock);

  // Get products by category
  const getProductsByCategory = (category) => {
    if (category === 'All') return products.filter(p => p.inStock);
    return products.filter(p => p.category === category && p.inStock);
  };

  // Get product by ID
  const getProductById = (productId) => products.find(p => p._id === productId);

  // Search products
  const searchProducts = (searchTerm) => {
    if (!searchTerm) return products.filter(p => p.inStock);
    const term = searchTerm.toLowerCase();
    return products.filter(p =>
      p.inStock && (
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      )
    );
  };

  // Get all categories
  const getAllCategories = () => {
    const categories = [...new Set(products.map(p => p.category))];
    return ['All', ...categories];
  };

  // Get seller stats
  const getSellerStats = () => ({
    totalProducts: products.length,
    inStock: products.filter(p => p.inStock).length,
    outOfStock: products.filter(p => !p.inStock).length
  });

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'allProducts' && e.newValue) {
        try {
          setProducts(JSON.parse(e.newValue));
        } catch (err) {
          console.error('Error parsing products:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
    getSellerStats
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
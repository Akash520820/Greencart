import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { dummyProducts } from '../../assets/assets';
import ProductCard from '../ClientsComponent/ProductCard';
import AuthModal from '../ClientsComponent/LogInSignIn/AuthModal';
import './AllProduct.css';

const AllProduct = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredProducts, setFilteredProducts] = useState(dummyProducts);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingProduct, setPendingProduct] = useState(null);

  // Get all unique categories
  const allCategories = ['All', ...new Set(dummyProducts.map(product => product.category))];

  useEffect(() => {
    // Get category from URL parameter
    const categoryFromUrl = searchParams.get('category');
    
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
      filterProducts(categoryFromUrl);
    } else {
      setSelectedCategory('All');
      setFilteredProducts(dummyProducts);
    }
  }, [searchParams]);

  const filterProducts = (category) => {
    if (category === 'All') {
      setFilteredProducts(dummyProducts);
    } else {
      const filtered = dummyProducts.filter(product => product.category === category);
      setFilteredProducts(filtered);
    }
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    
    if (category === 'All') {
      setSearchParams({});
      setFilteredProducts(dummyProducts);
    } else {
      setSearchParams({ category });
      filterProducts(category);
    }
  };

  const handleLoginRequired = (product) => {
    setPendingProduct(product);
    setShowAuthModal(true);
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
    // Don't clear pending product immediately - let AuthModal handle it
  };

  return (
    <>
      <div className="all-products-page">
        <div className="container">
          {/* Page Header */}
          <div className="all-products-header">
            <h1 className="all-products-title">All Products</h1>
            <p className="all-products-subtitle">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            </p>
          </div>

          {/* Category Filter */}
          <div className="category-filter">
            {allCategories.map((category, index) => (
              <button
                key={index}
                className={`category-filter-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="products-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product}
                  onLoginRequired={handleLoginRequired}
                />
              ))
            ) : (
              <div className="no-products">
                <p>No products found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AuthModal 
        show={showAuthModal} 
        onClose={handleCloseModal}
        pendingProduct={pendingProduct}
        onProductAdded={() => setPendingProduct(null)}
      />
    </>
  );
};

export default AllProduct;
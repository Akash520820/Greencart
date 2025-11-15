import React, { useState } from 'react';
import ProductCard from './ProductCard';
import AuthModal from './LogInSignIn/AuthModal';
import { BestSellerdummyProducts } from '../../assets/assets';
import './BestSeller.css';

const BestSeller = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingProduct, setPendingProduct] = useState(null);

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
      <div className="bestseller-section">
        <div className="container">
          <h2 className="bestseller-title">Best Sellers</h2>
          
          <div className="bestseller-grid">
            {BestSellerdummyProducts.map((product) => (
              <ProductCard 
                key={product._id} 
                product={product}
                onLoginRequired={handleLoginRequired}
              />
            ))}
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

export default BestSeller;
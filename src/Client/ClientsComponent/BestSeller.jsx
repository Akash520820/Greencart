import React from 'react';
import ProductCard from './ProductCard';
import { BestSellerdummyProducts } from '../../assets/assets';
import './BestSeller.css';

const BestSeller = () => {
  return (
    <div className="bestseller-section">
      <div className="container">
        <h2 className="bestseller-title">Best Sellers</h2>
        
        <div className="bestseller-grid">
          {BestSellerdummyProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestSeller;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryCard from './CategoryCard';
import { categories } from '../../assets/assets';
import './CategoriesSection.css';

const CategoriesSection = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (path) => {
    // Navigate to AllProduct page with category filter as URL parameter
    navigate(`/AllProduct?category=${path}`);
  };

  return (
    <div className="categories-section">
      <div className="container">
        <h2 className="categories-section-title">Categories</h2>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <CategoryCard 
              key={index} 
              category={category} 
              onClick={handleCategoryClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesSection;
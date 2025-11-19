
import "./Home.css";
import MainBanner from '../ClientsComponent/MainBanner';
import CategoriesSection from '../ClientsComponent/CategoriesSection';
import BestSeller from '../ClientsComponent/BestSeller';
import PromoBanner from '../ClientsComponent/PromoBanner';
import React, { useState, useEffect } from 'react';
import { useProducts } from '../../context/ProductContext';


const Home = () => {
  const { getAvailableProducts, loading: productsLoading } = useProducts();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!productsLoading) {
      const availableProducts = getAvailableProducts();
      setProducts(availableProducts);
      setIsLoading(false);
      console.log('Home: Loaded products:', availableProducts.length);
    }
  }, [productsLoading]);

  if (isLoading) {
    return (
      <div className="home-page">
        <div className="container">
          <div className="products-loading">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container  Homecontainer'>
      <MainBanner />
      <CategoriesSection />
      <BestSeller />
      <PromoBanner />
    </div>
  );
};

export default Home;




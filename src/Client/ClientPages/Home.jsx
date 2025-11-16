import React from 'react'
import "./Home.css";
import MainBanner from '../ClientsComponent/MainBanner';
import CategoriesSection from '../ClientsComponent/CategoriesSection';
import BestSeller from '../ClientsComponent/BestSeller';
import PromoBanner from '../ClientsComponent/PromoBanner';


const Home = () => {
  return (
    <>
    <div className='container  Homecontainer'>
      <MainBanner />
      <CategoriesSection />
      <BestSeller />
      <PromoBanner />
    </div>
    </>
  )
}

export default Home;

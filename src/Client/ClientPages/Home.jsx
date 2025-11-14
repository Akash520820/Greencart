import React from 'react'
import "./Home.css";
import MainBanner from '../ClientsComponent/MainBanner';
import CategoriesSection from '../ClientsComponent/CategoriesSection';
import BestSeller from '../ClientsComponent/BestSeller';


const Home = () => {
  return (
    <>
    <div className='container  Homecontainer'>
      <MainBanner />
      <CategoriesSection />
      <BestSeller />
    </div>
    </>
  )
}

export default Home;

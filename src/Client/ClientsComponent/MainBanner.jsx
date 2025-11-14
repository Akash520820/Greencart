import React from 'react';
import './MainBanner.css';
import { assets } from '../../assets/assets';

const MainBanner = () => {
  return (
    <div className="MainBannerContainer" style={{backgroundImage: `url(${assets.main_banner_bg})`}}>
      <div className="container">
        <div className="row align-items-center MainBannerRow">
          <div className="col-lg-6 col-md-6 col-12 MainBannerContent">
            <h1 className="MainBannerHeading">
              Freshness You Can Trust, Savings You will Love!
            </h1>
            <div className="MainBannerButtons">
              <button className="MainBannerButtonPrimary">
                Shop now
              </button>
              <button className="MainBannerButtonSecondary">
                Explore deals <span className="MainBannerArrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
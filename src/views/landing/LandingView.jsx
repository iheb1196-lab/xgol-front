import React from "react";
import "./landing.scss";
import LandingSlides from "../../components/landingSlides";
import Button from "../../components/buttonLink";

const LandingView = () => {
  return (
    <div className="landing-container">
      <img src="/assets/images/logo.svg" alt="" />
      <div className="landing_body">
        <div className="swiper-container">
          <LandingSlides />
        </div>
        <div className="buttons-container">
          <Button path={"/signup"} text={"Get Started"} primary />
          <Button path={"/login"} text={"Login"} />
        </div>
      </div>
      <span className="tagline">
        designed By <b>Adaska</b>
      </span>
    </div>
  );
};

export default LandingView;

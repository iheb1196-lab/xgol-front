import "./landingSlides.css";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { slides } from "../../mock/landingSlides";
import SlideItem from "../slideItem/SlideItem";
const LandingSlides = () => {
  const pagination = {
    clickable: true,
  };
 
  return (
    <>
      <Swiper
        pagination={pagination}
        modules={[Pagination]}
        className="mySwiper"
      >
        {slides.map((e) => (
          <SwiperSlide>
            <SlideItem item={e} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default LandingSlides;

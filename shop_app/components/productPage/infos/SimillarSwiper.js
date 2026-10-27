import Link from 'next/link'
import { simillar_products } from "../../../data/products";
import styles from "./styles.module.scss";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Navigation } from "swiper/modules";

export default function SimillarSwiper() {
  // Защита от undefined, если массив пустой или не импортировался
  if (!simillar_products || !Array.isArray(simillar_products)) {
    return null; 
  }
    
  return (
    <Swiper
      slidesPerView={4}
      spaceBetween={5}
      slidesPerGroup={3}
      navigation={true}
      modules={[Navigation]}
      className="swiper simillar_swiper products__swiper"
      breakpoints={{
        340: {
          width: 340,
          slidesPerView: 4,
        },
      }}
    >
      {simillar_products.map((p, index) => (
        <SwiperSlide key={index}>
          <Link href="">
            <img src={p} alt="" />
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
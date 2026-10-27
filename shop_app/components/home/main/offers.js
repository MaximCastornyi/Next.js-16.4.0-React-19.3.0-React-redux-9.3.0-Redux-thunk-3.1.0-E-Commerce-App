import styles from "./styles.module.scss";
import { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation"; // Рекомендуется также подключить стили навигации

// import required modules from "swiper/modules" (для Swiper 9+)
import { Pagination, Navigation } from "swiper/modules";
import Link from "next/link";

export default function Offers() {


  const offersAarray = [
    {
      image: "/images/offers/1.jpg",
      price: "144.37",
      discount: "17",
    },
    {
      image: "/images/offers/2.jpg",
      price: "12.76",
      discount: "19",
    },
    {
      image: "/images/offers/3.jpg",
      price: "4.09",
      discount: "32",
    },
    {
      image: "/images/offers/4.jpg",
      price: "9.61",
      discount: "90",
    },
    {
      image: "/images/offers/5.jpg",
      price: "6.25",
      discount: "45",
    },
    {
      image: "/images/offers/6.jpg",
      price: "13.74",
      discount: "10",
    },
    {
      image: "/images/offers/7.jpg",
      price: "198.2",
      discount: "5",
    },
  ];


  return (
    <div className={styles.offers}>
      <div className={styles.offers__text}>
        <p>
          use code <b>"NetDevs"</b> for 30% off all products.
        </p>
        <Link href="/browse">Shop now</Link>
      </div>
      <Swiper
        slidesPerView={3}
        spaceBetween={10}
        navigation={true}
        modules={[Pagination, Navigation]}
        className={styles.offersSwiper}
      >
        {offersAarray.map((offer, i) => (
          <SwiperSlide key={i}>
            <Link href="">
              <img src={offer.image} alt="" />
            </Link>
            <span>{offer.price}$</span>
            <span>-{offer.discount}%</span>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
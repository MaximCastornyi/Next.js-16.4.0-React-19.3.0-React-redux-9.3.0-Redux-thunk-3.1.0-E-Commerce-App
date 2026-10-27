import styles from "./styles.module.scss";
import { MdFlashOn } from "react-icons/md";
import Countdown from "../../countdown";
import { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Navigation } from "swiper/modules";
import FlashCard from "./Card";

export default function FlashDeals() {


const flashDealsArray = [
  {
    image:
      "/images/flash_swiper/1.jpg",
    price: "91",
    discount: "11",
    link: "",
    sold: "30",
  },
  {
    image:
      "/images/flash_swiper/2.jpg",
    price: "73",
    discount: "25",
    link: "",
    sold: "61",
  },
  {
    image:
      "/images/flash_swiper/3.jpg",
    price: "254",
    discount: "36",
    link: "",
    sold: "12",
  },
  {
    image:
      "/images/flash_swiper/4.jpg",
    price: "1687",
    discount: "20",
    link: "",
    sold: "96",
  },
  {
    image:
      "/images/flash_swiper/5.jpg",
    price: "126",
    discount: "8",
    link: "",
    sold: "12",
  },
  {
    image:
      "/images/flash_swiper/6.jpg",
    price: "65",
    discount: "7",
    link: "",
    sold: "82",
  },
  {
    image:
      "/images/flash_swiper/7.jpg",
    price: "41",
    discount: "9",
    link: "",
    sold: "52",
  },
  {
    image:
      "/images/flash_swiper/8.jpg",
    price: "288",
    discount: "35",
    link: "",
    sold: "49",
  },
];


  return (
    <div className={styles.flashDeals}>
      <div className={styles.flashDeals__header} style={{backgroundColor: "rgb(248, 223, 37)"}}>
        <h1>
          FLASH SALE
          <MdFlashOn />
        </h1>
        <Countdown date={new Date("2026-10-31T23:59:59")} />
      </div>
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        navigation={true}
        modules={[Navigation]}
        className="flashDeals__swiper"
        breakpoints={{
          450: {
            slidesPerView: 2,
          },
          630: {
            slidesPerView: 3,
          },
          920: {
            slidesPerView: 4,
          },
          1232: {
            slidesPerView: 5,
          },
          1520: {
            slidesPerView: 6,
          },
        }}
      >
        <div className={styles.flashDeals__list}>
          {flashDealsArray.map((product, i) => (
            <SwiperSlide>
              <FlashCard product={product} key={i} />
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
    </div>
  );
}

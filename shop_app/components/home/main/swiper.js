import styles from "./styles.module.scss";
import { useRef } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";

export default function MainSwiper() {
    const progressCircle = useRef(null);
    const progressContent = useRef(null);

    const onAutoplayTimeLeft = (s, time, progress) => {
        progressCircle.current.style.setProperty("--progress", 1 - progress);
        progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    };

    return (
        <Swiper
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
            pagination={{
                clickable: true,
            }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            onAutoplayTimeLeft={onAutoplayTimeLeft}
            className={styles.swiper}
            style={{
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)"
            }}
        >
            {[...Array(9).keys()].map((i) => (
                <SwiperSlide key={i}>
                    <img src={`/images/swiper/${i + 1}.jpg`} alt={`Slide ${i + 1}`} />
                </SwiperSlide>
            ))}

            {/* Круглый прогресс-бар автопрокрутки */}
            <div className={styles.autoplayProgress} slot="container-end">
                <svg viewBox="0 0 48 48" ref={progressCircle}>
                    <circle cx="24" cy="24" r="20"></circle>
                </svg>
                <span ref={progressContent}></span>
            </div>
        </Swiper>
    );
}
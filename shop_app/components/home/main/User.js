import { useSession } from "next-auth/react";
import Link from "next/link";
import { IoSettingsOutline } from "react-icons/io5";
import { HiOutlineClipboardList } from "react-icons/hi";
import { BsHeart } from "react-icons/bs";
import { AiOutlineMessage } from "react-icons/ai";
import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';
import { EffectCards } from "swiper/modules";
import Image from 'next/image'
import styles from "./styles.module.scss";



export default function User() {
  const { data: session } = useSession();
  return (
    <div className={styles.user}>
      <div className={styles.user__container}>
        {session ? (
          <div className={styles.user__infos} style={{ marginTop: "35px" }}>
            <Image src={session.user?.image} alt="" width={50}
              height={50} />
            <h4>{session.user.name}</h4>
          </div>
        ) : (
          <div className={styles.user__infos} style={{ marginTop: "35px" }}>
            <Image
              src="/images/unknown_account.png"
              width={50}
              height={50}
              alt=""
            />
            <div className={styles.user__infos_btns}>
              <Link href="/signin">
                <button
                  style={{
                    width: "100px",
                    height: "35px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "600",
                    border: "none",
                    color: "#fff",
                    background: "linear-gradient(135deg, #0066ff, #4facfe)",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease"
                  }}
                >
                  Register
                </button>
              </Link>

              <Link href="/signin">
                <button
                  style={{
                    width: "100px",
                    height: "35px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "600",
                    border: "none",
                    color: "#333",
                    background: "linear-gradient(135deg, #e1e4e8, #ccced2)",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease"
                  }}
                >
                  Login
                </button>
              </Link>
            </div>
          </div>
        )}
        <ul className={styles.user__links} style={{ marginTop: "10px" }}>
          <li>
            <Link href="/profile">
              <IoSettingsOutline />
            </Link>
          </li>
          <li>
            <Link href="">
              <HiOutlineClipboardList />
            </Link>
          </li>
          <li>
            <Link href="">
              <AiOutlineMessage />
            </Link>
          </li>
          <li>
            <Link href="">
              <BsHeart />
            </Link>
          </li>
        </ul>
        <div className={styles.user__swiper}>
          <Image
            src="/new.png"
            alt=""
            className={styles.new}
            height={100}
            width={100}
          />
          <Swiper
            effect={"cards"}
            grabCursor={true}
            modules={[EffectCards]}
            className={styles.userSwiper}
          >
            {/* Генерируем массив от 1 до 7 для картинок от 1.png до 7.png */}
            {[...Array(7)].map((_, i) => (
              <SwiperSlide key={i}>
                <Link href="">
                  <img src={`/images/cards_swiper/${i + 1}.jpg`} alt={`Card ${i + 1}`} />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
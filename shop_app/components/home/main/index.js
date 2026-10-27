import styles from "./styles.module.scss";
import MainSwiper from "./swiper";
import { useSession } from "next-auth/react";
import Menu from "./Menu";
import Link from "next/link";
import { IoSettingsOutline } from "react-icons/io5";
import { HiOutlineClipboardList } from "react-icons/hi";
import { AiOutlineMessage } from "react-icons/ai";
import { BsHeart } from "react-icons/bs";
//-----------------------------
import { useRef, useState } from "react";
import Header from "./Header";
import Offers from "./offers";
import User from "./User";

export default function Main() {

    return (
        <div className={styles.main}>
            <Header />
            <Menu />
            <MainSwiper />
            <Offers />
            <User />
        </div>
    );
}
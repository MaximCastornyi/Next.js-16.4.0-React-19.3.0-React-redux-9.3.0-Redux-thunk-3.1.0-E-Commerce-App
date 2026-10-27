import styles from "./styles.module.scss";
import Link from "next/link";
//-------
import {
  GiLargeDress,
  GiClothes,
  GiWatch,
  GiBallerinaShoes,
  GiHeadphones,
  GiHealthCapsule,
  GiSportMedal,
  GiBigDiamondRing,
  GiGearHammer,
} from "react-icons/gi";
import { MdOutlineSportsEsports, MdOutlineSmartToy } from "react-icons/md";
import { BiCameraMovie, BiGift, BiCategory } from "react-icons/bi";
import { FaBaby } from "react-icons/fa";
import { HiOutlineHome } from "react-icons/hi";
import { AiOutlineSecurityScan } from "react-icons/ai";
import { BsPhoneVibrate } from "react-icons/bs";
//-------

export default function Menu() {
  const menuArray = [
    {
      name: "Women's Fashion",
      link: "",
      icon: <GiLargeDress />,
      subMenu: [{ name: "", link: "" }],
      brands: [],
      images: [],
    },
    {
      name: "Men's Fashion",
      link: "",
      icon: <GiClothes />,
      subMenu: [{ name: "", link: "" }],
      brands: [],
      images: [],
    },
    {
      name: "Electronics",
      link: "",
      icon: <GiHeadphones />,
      subMenu: [{ name: "", link: "" }],
      brands: [],
      images: [],
    },
    {
      name: "Jewlery & Watches",
      link: "",
      icon: <GiWatch />,
      subMenu: [{ name: "", link: "" }],
      brands: [],
      images: [],
    },
    {
      name: "Home, Pet & Appliances",
      link: "",
      icon: <HiOutlineHome />,
      subMenu: [{ name: "", link: "" }],
      brands: [],
      images: [],
    },
    {
      name: "Beauty, Health & Hair",
      link: "",
      icon: <GiHealthCapsule />,
      subMenu: [{ name: "", link: "" }],
      brands: [],
      images: [],
    },
    {
      name: "Shoes,Sneakers,Heels",
      link: "",
      icon: <GiBallerinaShoes />,
      subMenu: [{ name: "", link: "" }],
      brands: [],
      images: [],
    },
    {
      name: "Accessories",
      link: "",
      icon: <GiBigDiamondRing />,
      subMenu: [{ name: "", link: "" }],
      brands: [],
      images: [],
    },
    {
      name: "Sports & Entertainment",
      link: "",
      icon: <GiSportMedal />,
      subMenu: [{ name: "", link: "" }],
      brands: [],
      images: [],
    },
    {
      name: "Kids & Babies",
      link: "",
      icon: <FaBaby />,
      subMenu: [{ name: "", link: "" }],
      brands: [],
      images: [],
    },
    {
      name: "Movies & Television",
      link: "",
      icon: <BiCameraMovie />,
      subMenu: [{ name: "", link: "" }],
      brands: [],
      images: [],
    },
    {
      name: "Gaming, Video Games",
      link: "",
      icon: <MdOutlineSportsEsports />,
      subMenu: [{ name: "", link: "" }],
      brands: [],
      images: [],
    },
    {
      name: "Phones & Telecommunications",
      link: "",
      icon: <BsPhoneVibrate />,
      subMenu: [{ name: "", link: "" }],
      brands: [],
      images: [],
    },
    {
      name: "Toys & Hobbies",
      link: "",
      icon: <MdOutlineSmartToy />,
      subMenu: [{ name: "", link: "" }],
      brands: [],
      images: [],
    },
    {
      name: "Gifts & Crafts",
      link: "",
      icon: <BiGift />,
      subMenu: [{ name: "", link: "" }],
      brands: [],
      images: [],
    },
    {
      name: "Machinery",
      link: "",
      icon: <GiGearHammer />,
      subMenu: [{ name: "", link: "" }],
      brands: [],
      images: [],
    },
    {
      name: "Security, Safety",
      link: "",
      icon: <AiOutlineSecurityScan />,
      subMenu: [{ name: "", link: "" }],
      brands: [],
      images: [],
    },
  ];

  return (
    <div className={styles.menu}>
      <ul>
        <li>
          <a className={styles.menu__header}>
            <BiCategory />
            <b>Categories</b>
          </a>
        </li>
        <div className={styles.menu__list}>
          {menuArray.map((item, i) => (
            <li key={i}>
              <Link href={item.link || "#"}>
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </div>
      </ul>
    </div>
  );
}
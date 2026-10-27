import { useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import { FaMinus } from "react-icons/fa";
import styles from "../styles.module.scss";
import { useRouter } from "next/router";

export default function BrandsFilter({ brandHandler, replaceQuery }) {
  const router = useRouter();
  const [show, setShow] = useState(true);
  
  // Список брендов, файлы которых физически находятся в public/images/brands/
  const brandsList = [
    "Acer",
    "Blitz",
    "Hugo Boss",
    "Louis Vuitton",
    "Nike",
    "Prada",
    "Pull & Bear",
    "Razer",
    "Rolex",
    "Shein",
    "Zara"
  ];

  return (
    <div className={styles.filter}>
      <h3 onClick={() => setShow((prev) => !prev)} style={{ cursor: "pointer" }}>
        Brands <span>{show ? <FaMinus /> : <BsPlusLg />}</span>
      </h3>
      {show && (
        <div className={styles.filter__sizes}>
          {brandsList.map((brand, i) => {
            const check = replaceQuery("brand", brand);
            const imagePath = `/images/brands/${brand}.png`;
            
            return (
              <button
                key={i}
                className={`${styles.filter__brand} ${
                  check.active ? styles.activeFilter : ""
                }`}
                onClick={() => brandHandler(check.result)}
                title={brand}
              >
                <img 
                  src={imagePath}
                  alt={brand} 
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
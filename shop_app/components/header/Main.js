import Link from "next/link";
import styles from "./styles.module.scss";
import { RiSearch2Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useRouter } from "next/router";
import { MdOutlineShoppingCart } from "react-icons/md";

export default function Main({ searchHandler }) {
  const router = useRouter();
  const [query, setQuery] = useState(router.query.search || "");
  
  // Достаем cartItems из слайса cart в сторе
  const { cartItems } = useSelector((state) => state.cart);

  // Считаем общее количество товаров 
  // (если у вас уникальные товары добавляются просто в массив: cartItems.length)
  // (если есть поле qty у товаров: cartItems.reduce((acc, item) => acc + item.qty, 0))
  const cartLength = cartItems.reduce((acc, item) => acc + (item.qty || 1), 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (router.pathname !== "/browse") {
      if (query.length > 1) {
        router.push(`/browse?search=${query}`);
      }
    } else {
      searchHandler(query);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.main__container}>
        <Link href="/" className={styles.logo}>
          <img src="../../../logo.png" alt="Logo" />
        </Link>
        <form onSubmit={(e) => handleSearch(e)} className={styles.search}>
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className={styles.search__icon}>
            <RiSearch2Line />
          </button>
        </form>
        <Link href="/cart" className={styles.cart}>
          <MdOutlineShoppingCart />
          {/* Динамическое отображение количества товаров */}
          <span>{cartLength}</span>
        </Link>
      </div>
    </div>
  );
}
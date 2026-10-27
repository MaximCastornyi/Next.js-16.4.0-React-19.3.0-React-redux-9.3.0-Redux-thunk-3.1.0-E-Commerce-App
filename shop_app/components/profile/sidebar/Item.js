import { useState } from "react";
import styles from "./styles.module.scss";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { HiMinusSm, HiPlusSm } from "react-icons/hi";
import slugify from "slugify";
import { useRouter } from "next/router";

export default function Item({ item, visible, index }) {
  const [show, setShow] = useState(visible);
  const router = useRouter();

  return (
    <li>
      {item.heading === "Sign out" ? (
        <b onClick={() => signOut()} style={{ cursor: "pointer" }}>
          Sign out
        </b>
      ) : (
        <b onClick={() => setShow((prev) => !prev)} style={{ cursor: "pointer" }}>
          {item.heading} {show ? <HiMinusSm /> : <HiPlusSm />}
        </b>
      )}

      {show && item.links && (
        <ul>
          {item.links.map((link, i) => {
            const isOrders = link.link.startsWith("/profile/orders");
            const linkSlug = slugify(link.name, { lower: true });
            
            // Условие для определения активного класса
            const isActive = isOrders
              ? (router.query.q?.split("__")[0] || "") === linkSlug
              : (router.query.q || "") === linkSlug;

            // Формируем корректный URL
            const hrefPath = isOrders
              ? `${link.link}?tab=${index}&q=${linkSlug}__${link.filter}`
              : `${link.link}?tab=${index}&q=${linkSlug}`;

            return (
              <li key={link._id || i} className={isActive ? styles.active : ""}>
                <Link href={hrefPath}>
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}
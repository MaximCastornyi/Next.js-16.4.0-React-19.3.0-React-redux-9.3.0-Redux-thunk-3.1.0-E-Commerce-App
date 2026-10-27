import { sidebarData } from "../../../data/profile";
import Item from "./Item";
import styles from "./styles.module.scss";

export default function Sidebar({ data }) {
  // Проверяем наличие данных, чтобы избежать ошибок при загрузке сессии
  if (!data) return null;

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebar__container}>
        <img src={data.image || "/images/default-avatar.png"} alt="" />
        <span className={styles.sidebar__name}>{data.name}</span>
        <ul>
          {sidebarData.map((item, i) => (
            <Item
              key={i} // <--- Исправлено с kye на key
              item={item}
              visible={data.tab == i.toString()}
              index={i.toString()}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
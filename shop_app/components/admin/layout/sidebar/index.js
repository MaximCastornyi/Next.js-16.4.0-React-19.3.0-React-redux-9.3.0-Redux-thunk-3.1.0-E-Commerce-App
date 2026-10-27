import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.scss";
import { toggleSidebar } from "../../../../store/ExpandSlice";
//-----------------------
import {
  MdArrowForwardIos,
  MdOutlineCategory,
  MdSpaceDashboard,
} from "react-icons/md";
import { FcSalesPerformance } from "react-icons/fc";
import { IoListCircleSharp, IoNotificationsSharp } from "react-icons/io5";
import { ImUsers } from "react-icons/im";
import { AiFillMessage } from "react-icons/ai";
import { FaThList } from "react-icons/fa";
import { BsPatchPlus } from "react-icons/bs";
import {
  RiCoupon3Fill,
  RiLogoutCircleFill,
  RiSettingsLine,
} from "react-icons/ri";
//-----------------------
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Sidebar() {
  const router = useRouter();
  const currentPath = router.pathname;
  const { data: session } = useSession();
  const dispatch = useDispatch();

  // Оптимизированный селектор — берем только нужную переменную
  const expand = useSelector((state) => state.expandSidebar?.expandSidebar);

  const handleExpand = () => {
    dispatch(toggleSidebar());
  };

  return (
    <div className={`${styles.sidebar} ${expand ? styles.opened : ""}`}>
      <div className={styles.sidebar__toggle} onClick={handleExpand}>
        <div
          style={{
            transform: expand ? "rotate(180deg)" : "none",
            transition: "all .2s",
          }}
        >
          <MdArrowForwardIos />
        </div>
      </div>
      <div className={styles.sidebar__container}>
        <div className={styles.sidebar__header}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className={styles.sidebar__user}>
          <img src={session?.user?.image || "/images/default-avatar.png"} alt="" />
          <div className={styles.show}>
            <span>Welcome back 👋</span>
            <span>{session?.user?.name}</span>
          </div>
        </div>
        
        <ul className={styles.sidebar__list}>
          <li className={currentPath === "/admin/dashboard" ? styles.active : ""}>
            <Link href="/admin/dashboard" className={styles.navLink}>
              <MdSpaceDashboard />
              <span className={styles.show}>Dashboard</span>
            </Link>
          </li>
          <li className={currentPath === "/admin/dashboard/sales" ? styles.active : ""}>
            <Link href="/admin/dashboard/sales" className={styles.navLink}>
              <FcSalesPerformance />
              <span className={styles.show}>Sales</span>
            </Link>
          </li>
          <li className={currentPath === "/admin/dashboard/orders" ? styles.active : ""}>
            <Link href="/admin/dashboard/orders" className={styles.navLink}>
              <IoListCircleSharp />
              <span className={styles.show}>Orders</span>
            </Link>
          </li>
          <li className={currentPath === "/admin/dashboard/users" ? styles.active : ""}>
            <Link href="/admin/dashboard/users" className={styles.navLink}>
              <ImUsers />
              <span className={styles.show}>Users</span>
            </Link>
          </li>
          <li className={currentPath === "/admin/dashboard/messages" ? styles.active : ""}>
            <Link href="/admin/dashboard/messages" className={styles.navLink}>
              <AiFillMessage />
              <span className={styles.show}>Messages</span>
            </Link>
          </li>
        </ul>

        <div className={styles.sidebar__dropdown}>
          <div className={styles.sidebar__dropdown_heading}>
            <div className={styles.show}>Product</div>
          </div>
          <ul className={styles.sidebar__list}>
            <li className={currentPath === "/admin/dashboard/product/all" ? styles.active : ""}>
              <Link href="/admin/dashboard/product/all" className={styles.navLink}>
                <FaThList />
                <span className={styles.show}>All Products</span>
              </Link>
            </li>
            <li className={currentPath === "/admin/dashboard/product/create" ? styles.active : ""}>
              <Link href="/admin/dashboard/product/create" className={styles.navLink}>
                <BsPatchPlus />
                <span className={styles.show}>Create Product</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className={styles.sidebar__dropdown}>
          <div className={styles.sidebar__dropdown_heading}>
            <div className={styles.show}>Categories / Subs</div>
          </div>
          <ul className={styles.sidebar__list}>
            <li className={currentPath === "/admin/dashboard/categories" ? styles.active : ""}>
              <Link href="/admin/dashboard/categories" className={styles.navLink}>
                <MdOutlineCategory />
                <span className={styles.show}>Categories</span>
              </Link>
            </li>
            <li className={currentPath === "/admin/dashboard/subCategories" ? styles.active : ""}>
              <Link href="/admin/dashboard/subCategories" className={styles.navLink}>
                <div style={{ transform: "rotate(180deg)", display: "flex" }}>
                  <MdOutlineCategory />
                </div>
                <span className={styles.show}>Sub-Categories</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className={styles.sidebar__dropdown}>
          <div className={styles.sidebar__dropdown_heading}>
            <div className={styles.show}>Coupons</div>
          </div>
          <ul className={styles.sidebar__list}>
            <li className={currentPath === "/admin/dashboard/coupons" ? styles.active : ""}>
              <Link href="/admin/dashboard/coupons" className={styles.navLink}>
                <RiCoupon3Fill />
                <span className={styles.show}>Coupons</span>
              </Link>
            </li>
          </ul>
        </div>

        <nav>
          <ul className={`${styles.sidebar__list} ${expand ? styles.nav_flex : ""}`}>
            <li key="settings">
              <Link href="#" className={styles.navLink}>
                <RiSettingsLine />
              </Link>
            </li>
            <li key="notifications">
              <Link href="#" className={styles.navLink}>
                <IoNotificationsSharp />
              </Link>
            </li>
            <li key="messages">
              <Link href="#" className={styles.navLink}>
                <AiFillMessage />
              </Link>
            </li>
            <li key="logout">
              <Link href="/" className={styles.navLink}>
                <RiLogoutCircleFill />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
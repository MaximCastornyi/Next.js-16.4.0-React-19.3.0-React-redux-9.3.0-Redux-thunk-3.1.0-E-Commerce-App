import { getSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../../components/profile/layout";
import { ordersLinks } from "../../data/profile";
import Order from "../../models/Order";

import { FiExternalLink } from "react-icons/fi";
import slugify from "slugify";
import styles from "../../styles/profile.module.scss";

export default function Orders({ user, tab, orders }) {
  const router = useRouter();
  
  // Безопасное получение первой части query параметра
  const queryQ = router.query.q || "";
  const activeFilterSlug = typeof queryQ === "string" ? queryQ.split("__")[0] : "";

  return (
    <Layout session={user?.user} tab={tab}>
      <Head>
        <title>Orders</title>
      </Head>
      <div className={styles.orders}>
        <div className={styles.header}>
          <h1>MY ORDERS</h1>
        </div>
        <nav>
          <ul>
            {ordersLinks.map((link, i) => {
              const linkSlug = slugify(link.name, { lower: true });
              const isActive = linkSlug === activeFilterSlug;

              return (
                <li
                  key={i}
                  className={isActive ? styles.active : ""}
                >
                  <Link
                    href={`/profile/orders?tab=${tab}&q=${linkSlug}__${link.filter}`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <table>
          <thead>
            <tr>
              <td>Order id</td>
              <td>Products</td>
              <td>Payment Method</td>
              <td>Total</td>
              <td>Paid</td>
              <td>Status</td>
              <td>view</td>
            </tr>
          </thead>
          <tbody>
            {orders && orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td className={styles.orders__images}>
                  {order.products.map((p) => (
                    <img src={p.image} key={p._id} alt="" />
                  ))}
                </td>
                <td>
                  {order.paymentMethod === "paypal"
                    ? "Paypal"
                    : order.paymentMethod === "credit_card"
                    ? "Credit Card"
                    : "COD"}
                </td>
                <td>{order.total}$</td>
                <td className={styles.orders__paid}>
                  {order.isPaid ? (
                    <img src="/images/verified.png" alt="" />
                  ) : (
                    <img src="/images/unverified.png" alt="" />
                  )}
                </td>
                <td>{order.status}</td>
                <td>
                  <Link href={`/order/${order._id}`}>
                    <FiExternalLink />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const { query, req } = ctx;
  const session = await getSession({ req });
  const tab = query.tab || 0;
  
  // Безопасный разбор фильтра из query.q
  const qParam = query.q || "";
  const filter = typeof qParam === "string" ? qParam.split("__")[1] : undefined;

  let orders = [];
  const userId = session?.user?.id;

  if (!userId) {
    return {
      props: { user: session || null, tab, orders: [] },
    };
  }

  if (!filter) {
    orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();
  } else if (filter === "paid") {
    orders = await Order.find({ user: userId, isPaid: true })
      .sort({ createdAt: -1 })
      .lean();
  } else if (filter === "unpaid") {
    orders = await Order.find({ user: userId, isPaid: false })
      .sort({ createdAt: -1 })
      .lean();
  } else {
    orders = await Order.find({ user: userId, status: filter })
      .sort({ createdAt: -1 })
      .lean();
  }

  return {
    props: { user: session, tab, orders: JSON.parse(JSON.stringify(orders)) },
  };
}
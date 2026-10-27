
import Head from "next/head";
import Header from "../../header";
import Sidebar from "../sidebar";
import styles from "./styles.module.scss";
import Footer from "../../footer";

export default function Layout({ session, tab, children }) {

  return (
    <>
    <div className={styles.layout}>
      <Head>
        <title>{session?.user?.name}</title>
      </Head>
      <Header />
      <div className={styles.layout__container}>
        <Sidebar
          data={{
            ...session,
            tab,
          }}
        />
        <div className={styles.layout__content}>{children}</div>
      </div>
    </div>
     <Footer />
    </>
  );
}

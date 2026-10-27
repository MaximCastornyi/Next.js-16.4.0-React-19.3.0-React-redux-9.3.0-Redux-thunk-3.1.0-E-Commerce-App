import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import Header from '../components/header'
import Footer from '../components/footer'
import db from "../utils/db";
import axios from "axios";
import { useSession, signIn, signOut } from "next-auth/react"
import Main from "../components/home/main";
import FlashDeals from '../components/home/flashDeals';
import Category from "../components/home/category";
import {
  women_accessories,
  women_dresses,
  women_shoes, gamingSwiper, women_swiper
} from "../data/home";
import { useMediaQuery } from "react-responsive";
import ProductsSwiper from "../components/productsSwiper";
import Product from "../models/Product";
import ProductCard from "../components/productCard";

export default function Home({ country, products }) {

  const { data: session } = useSession()
  const isMedium = useMediaQuery({ query: "(max-width:850px)" });
  const isMobile = useMediaQuery({ query: "(max-width:550px)" });

  return (
    <div className={styles.home}>
      <Header country={country} />
      <div className={styles.home}>
        <div className={styles.container}>
          <Main />
          <FlashDeals />
          <div className={styles.home__category}>
            <Category
              header="Dresses"
              products={women_dresses}
              background="#997ff7"
            />
            {!isMedium && (
              <Category
                header="Shoes"
                products={women_shoes}
                background="#aff093"
              />
            )}
            {isMobile && (
              <Category
                header="Shoes"
                products={women_shoes}
                background="#aff093"
              />
            )}
            <Category
              header="Accessories"
              products={women_accessories}
              background="#8f8f93"
            />
          </div>

          {/* <ProductsSwiper header="For Women"
            bg="#2f82ff" products={women_swiper} /> */}
          <ProductsSwiper
            products={gamingSwiper}
            header="For Gamers"
            bg="#f36ad7"
            
          />
          <div className={styles.products}>
            {products.map((product) => (
              <ProductCard product={product} key={product._id} />
            ))}
          </div>
        </div>
      </div>
      <Footer country={country} />
    </div>
  )
}


export async function getServerSideProps() {
  db.connectDb();
  let products = await Product.find().sort({ createdAt: -1 }).lean();
  let data = await axios
    .get("https://api.ipregistry.co/?key=ira_Q44KDCBOpNcwJpE2sSMXC5NdMkYQGS1cAxV8")
    .then((res) => {
      return res.data.location.country;
    })
    .catch((err) => {
      //console.log(err);
    });
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      //country: { name: data.name, flag: data.flag.emojitwo },
      country: {
        name: "USA",
        flag: "/images/flag.jpg",
      },
    },
  };
}
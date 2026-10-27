import db from "../../utils/db";
import Product from "../../models/Product";
import Category from "../../models/Category";
import SubCategory from "../../models/SubCategory";
import User from "../../models/User";
import Head from "next/head";
import Header from "../../components/header";
import Footer from "../../components/footer";
import MainSwiper from "../../components/productPage/mainSwiper";
import { useState } from "react";
import Infos from "../../components/productPage/infos";
import Reviews from "../../components/productPage/reviews";
import ProductsSwiper from "../../components/productsSwiper";
import styles from "../../styles/product.module.scss";

export default function product({ product, related }) {
  const [activeImg, setActiveImg] = useState("");
  const country = {
    name: "USA",
    flag: "/images/flag.jpg",
  };

  return (
    <>
      <Head>
        <title>{product.name}</title>
      </Head>
      <Header country={country} />
      <div className={styles.product}>
        <div className={styles.product__container}>
          <div className={styles.path}>
            Home / {product.category.name}
            {product.subCategories.map((sub, index) => (
              <span key={index}>/{sub.name}</span>
            ))}
          </div>
          <div className={styles.product__main}>
            <MainSwiper images={product.images} activeImg={activeImg} />
            <Infos product={product} setActiveImg={setActiveImg} />
          </div>
          <Reviews product={product} />
          {/*
          <ProductsSwiper products={related} />
          */}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { query } = context;
  const slug = query.slug;
  const style = query.style || 0;
  const size = query.size || 0;

  // 1. Обязательно ждем установку соединения с БД
  await db.connectDb();

  //------------
  let product = await Product.findOne({ slug })
    .populate({ path: "category", model: Category })
    .populate({ path: "subCategories", model: SubCategory })
    .populate({ path: "reviews.reviewBy", model: User })
    .lean();

  if (!product) {
    return {
      notFound: true,
    };
  }

  let subProduct = product.subProducts[style] || product.subProducts[0];
  let prices = subProduct.sizes
    .map((s) => {
      return s.price;
    })
    .sort((a, b) => {
      return a - b;
    });

  // Функция расчета процента отзывов
  function calculatePercentage(num) {
    if (!product.reviews || product.reviews.length === 0) return "0.0";
    return (
      (product.reviews.reduce((a, review) => {
        return (
          a +
          (review.rating == Number(num) || review.rating == Number(num) + 0.5)
        );
      }, 0) *
        100) /
      product.reviews.length
    ).toFixed(1);
  }

  let newProduct = {
    ...product,
    style,
    images: subProduct.images,
    sizes: subProduct.sizes,
    discount: subProduct.discount,
    sku: subProduct.sku,
    colors: product.subProducts.map((p) => {
      return p.color;
    }),
    priceRange: subProduct.discount
      ? `From ${(prices[0] - prices[0] / subProduct.discount).toFixed(2)} to ${(
          prices[prices.length - 1] -
          prices[prices.length - 1] / subProduct.discount
        ).toFixed(2)}$`
      : `From ${prices[0]} to ${prices[prices.length - 1]}$`,
    price:
      subProduct.discount > 0
        ? (
            subProduct.sizes[size].price -
            subProduct.sizes[size].price / subProduct.discount
          ).toFixed(2)
        : subProduct.sizes[size].price,
    priceBefore: subProduct.sizes[size].price,
    quantity: subProduct.sizes[size].qty,
    ratings: [
      { percentage: calculatePercentage("5") },
      { percentage: calculatePercentage("4") },
      { percentage: calculatePercentage("3") },
      { percentage: calculatePercentage("2") },
      { percentage: calculatePercentage("1") },
    ],
    reviews: product.reviews ? [...product.reviews].reverse() : [],
    allSizes: product.subProducts
      .map((p) => {
        return p.sizes;
      })
      .flat()
      .sort((a, b) => {
        return a.size - b.size;
      })
      .filter(
        (element, index, array) =>
          array.findIndex((el2) => el2.size === element.size) === index
      ),
  };

  const related = await Product.find({ category: product.category._id }).lean();
  
  db.disconnectDb();

  return {
    props: {
      product: JSON.parse(JSON.stringify(newProduct)),
      related: JSON.parse(JSON.stringify(related)),
    },
  };
}
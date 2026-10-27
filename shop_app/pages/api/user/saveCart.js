import { createRouter } from "next-connect";
import Product from "../../../models/Product";
import User from "../../../models/User";
import Cart from "../../../models/Cart";
import db from "../../../utils/db";
import auth from "../../../middleware/auth";

const router = createRouter();

router.use(auth).post(async (req, res) => {
  try {
    await db.connectDb();
    const { cart } = req.body;

    const user = await User.findById(req.user);
    if (!user) {
      await db.disconnectDb();
      return res.status(404).json({ message: "User not found" });
    }

    await Cart.findOneAndDelete({ user: user._id });

    const productsPromises = cart.map(async (item) => {
      const dbProduct = await Product.findById(item._id).lean();
      if (!dbProduct) return null;

      const subProduct = dbProduct.subProducts[item.style];
      if (!subProduct) return null;

      const sizeObj = subProduct.sizes.find((p) => p.size == item.size);
      const price = Number(sizeObj ? sizeObj.price : 0);

      const discount = Number(subProduct.discount) || 0;
      const finalPrice = discount > 0 ? price * (1 - discount / 100) : price;

      return {
        name: dbProduct.name,
        product: dbProduct._id,
        color: {
          color: item.color.color,
          image: item.color.image,
        },
        image: subProduct.images[0]?.url || "",
        qty: Number(item.qty),
        size: item.size,
        price: Number(finalPrice.toFixed(2)),
      };
    });

    const products = (await Promise.all(productsPromises)).filter(Boolean);

    const cartTotal = products.reduce(
      (acc, curr) => acc + curr.price * curr.qty,
      0
    );

    const newCart = await new Cart({
      products,
      cartTotal: Number(cartTotal.toFixed(2)),
      user: user._id,
    }).save();

    await db.disconnectDb();

    return res.status(200).json({
      message: "Cart updated successfully",
      cart: newCart,
    });
  } catch (error) {
    await db.disconnectDb();
    return res.status(500).json({ message: error.message });
  }
});

// Экспортируем обработчик для Next.js
export default router.handler({
  onError: (err, req, res) => {
    res.status(500).json({ message: err.toString() });
  },
});
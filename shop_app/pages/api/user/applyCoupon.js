import { createRouter } from "next-connect";
import User from "../../../models/User";
import Coupon from "../../../models/Coupon";
import Cart from "../../../models/Cart";
import db from "../../../utils/db";
import auth from "../../../middleware/auth";

const router = createRouter();

router.use(auth);

router.post(async (req, res) => {
  try {
    db.connectDb();
    const { coupon } = req.body;
    
    // Добавлен недостающий await
    const user = await User.findById(req.user);
    if (!user) {
      db.disconnectDb();
      return res.status(404).json({ message: "User not found" });
    }

    const checkCoupon = await Coupon.findOne({ coupon });
    if (checkCoupon == null) {
      db.disconnectDb();
      return res.json({ message: "Invalid coupon" });
    }

    const cart = await Cart.findOne({ user: req.user });
    if (!cart) {
      db.disconnectDb();
      return res.status(404).json({ message: "Cart not found" });
    }

    const { cartTotal } = cart;
    let totalAfterDiscount =
      cartTotal - (cartTotal * checkCoupon.discount) / 100;

    await Cart.findOneAndUpdate({ user: user._id }, { totalAfterDiscount });

    db.disconnectDb();
    
    return res.json({
      totalAfterDiscount: totalAfterDiscount.toFixed(2),
      discount: checkCoupon.discount,
    });
  } catch (error) {
    db.disconnectDb();
    return res.status(500).json({ message: error.message });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    res.status(500).json({ message: err.message });
  },
});
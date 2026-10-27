import { createRouter } from "next-connect";
import User from "../../../models/User";
import Order from "../../../models/Order";
import db from "../../../utils/db";
import auth from "../../../middleware/auth";

const router = createRouter();

// Подключаем middleware авторизации
router.use(auth);

router.post(async (req, res) => {
  try {
    await db.connectDb();
    
    const {
      products,
      shippingAddress,
      paymentMethod,
      total,
      totalBeforeDiscount,
      couponApplied,
    } = req.body;
    
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const newOrder = await new Order({
      user: user._id,
      products,
      shippingAddress,
      paymentMethod,
      total,
      totalBeforeDiscount,
      couponApplied,
    }).save();

    return res.json({
      order_id: newOrder._id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  } finally {
    await db.disconnectDb();
  }
});

export default router.handler({
  onError: (err, req, res) => {
    res.status(500).json({ message: err.message });
  },
});
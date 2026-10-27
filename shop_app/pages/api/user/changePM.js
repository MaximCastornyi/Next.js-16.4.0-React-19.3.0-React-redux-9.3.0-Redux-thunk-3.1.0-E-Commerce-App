import { createRouter } from "next-connect";
import User from "../../../models/User";
import db from "../../../utils/db";
import auth from "../../../middleware/auth";

const router = createRouter();

router.use(auth);

router.put(async (req, res) => {
  try {
    db.connectDb();
    const { paymentMethod } = req.body;
    
    // Используем findOneAndUpdate с флагом new: true, чтобы получить обновленного пользователя
    const user = await User.findByIdAndUpdate(
      req.user,
      {
        defaultPaymentMethod: paymentMethod,
      },
      { new: true }
    );

    if (!user) {
      db.disconnectDb();
      return res.status(404).json({ message: "User not found" });
    }

    db.disconnectDb();
    return res.json({ paymentMethod: user.defaultPaymentMethod });
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
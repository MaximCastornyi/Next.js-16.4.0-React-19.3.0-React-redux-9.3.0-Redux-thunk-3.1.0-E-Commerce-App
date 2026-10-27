import { createRouter } from "next-connect";
import auth from "../../../../middleware/auth";
import Order from "../../../../models/Order";
import db from "../../../../utils/db";

const router = createRouter();

// Подключаем middleware авторизации
router.use(auth);

router.put(async (req, res) => {
  try {
    console.log("hello from api");
    await db.connectDb();
    
    // Исправлена опечатка с req.qurey на req.query
    const order = await Order.findById(req.query.id);
    
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        email_address: req.body.email_address,
      };
      
      const newOrder = await order.save();
      await db.disconnectDb();
      
      return res.json({ message: "Order is paid.", order: newOrder });
    } else {
      await db.disconnectDb();
      return res.status(404).json({ message: "Order is not found." });
    }
  } catch (error) {
    await db.disconnectDb();
    return res.status(500).json({ message: error.message });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    res.status(500).json({ message: err.message });
  },
});
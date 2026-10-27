import auth from "../../../../middleware/auth"; // Если ваш auth-мидлвар поддерживает стандартную обертку, либо оставьте вызов
import Order from "../../../../models/Order";
import db from "../../../../utils/db";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await db.connectDb();
    
    // Получаем ID заказа из параметров маршрута ([id])
    const order_id = req.query.id;
    const { amount, id } = req.body;

    console.log("Processing payment for order:", order_id, "Amount:", amount);

    // Создаем PaymentIntent в Stripe
    const payment = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Сумма в центах
      currency: "USD",
      description: "NetsDevs Store",
      payment_method: id,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never", // Предотвращает нежелательные редиректы для карт
      },
    });

    const order = await Order.findById(order_id);
    
    if (!order) {
      await db.disconnectDb();
      return res.status(404).json({ message: "Order not found" });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: payment.id,
      status: payment.status,
      email_address: payment.receipt_email || req.user?.email || "",
    };

    await order.save();
    await db.disconnectDb();

    return res.status(200).json({ success: true, payment });
  } catch (error) {
    console.error("Stripe payment error:", error);
    await db.disconnectDb();
    return res.status(500).json({ message: error.message });
  }
}
import db from "../../../utils/db";
import Coupon from "../../../models/Coupon";
import auth from "../../../middleware/auth";
import admin from "../../../middleware/admin";

// Вспомогательная функция для запуска middleware в Pages API-роутах
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
};

export default async function handler(req, res) {
  try {
    // Проверяем авторизацию и права администратора
    await runMiddleware(req, res, auth);
    await runMiddleware(req, res, admin);

    await db.connectDb();

    switch (req.method) {
      case "POST": {
        const { coupon, discount, startDate, endDate } = req.body;
        const test = await Coupon.findOne({ coupon });
        
        if (test) {
          await db.disconnectDb();
          return res
            .status(400)
            .json({ message: "Coupon already exist, Try a different coupon" });
        }
        
        await new Coupon({ coupon, discount, startDate, endDate }).save();
        const coupons = await Coupon.find({}).sort({ updatedAt: -1 });

        await db.disconnectDb();
        return res.json({
          message: `Coupon ${coupon} has been created successfully.`,
          coupons,
        });
      }

      case "PUT": {
        const { id, coupon, discount, startDate, endDate } = req.body;
        await Coupon.findByIdAndUpdate(id, {
          coupon,
          discount,
          startDate,
          endDate,
        });
        const coupons = await Coupon.find({}).sort({ createdAt: -1 });

        await db.disconnectDb();
        return res.json({
          message: "Coupon has been updated successfuly",
          coupons,
        });
      }

      case "DELETE": {
        const { id } = req.body;
        // Заменили устаревший findByIdAndRemove на актуальный findByIdAndDelete
        await Coupon.findByIdAndDelete(id);
        const coupons = await Coupon.find({}).sort({ updatedAt: -1 });

        await db.disconnectDb();
        return res.json({
          message: "Coupon has been deleted successfuly",
          coupons,
        });
      }

      default:
        await db.disconnectDb();
        res.setHeader("Allow", ["POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    await db.disconnectDb();
    return res.status(500).json({ message: error.message });
  }
}
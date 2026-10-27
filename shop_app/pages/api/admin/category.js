import db from "../../../utils/db";
import Category from "../../../models/Category";
import slugify from "slugify";
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
    // Выполняем проверки авторизации и админ-прав
    await runMiddleware(req, res, auth);
    await runMiddleware(req, res, admin);

    await db.connectDb();

    switch (req.method) {
      case "POST": {
        const { name } = req.body;
        const test = await Category.findOne({ name });
        if (test) {
          await db.disconnectDb();
          return res.status(400).json({ 
            message: "Category already exist, Try a different name" 
          });
        }

        await new Category({ name, slug: slugify(name) }).save();
        const categories = await Category.find({}).sort({ updatedAt: -1 });
        
        await db.disconnectDb();
        return res.json({
          message: `Category ${name} has been created successfully.`,
          categories,
        });
      }

      case "PUT": {
        const { id, name } = req.body;
        // Обновляем имя и генерируем новый slug
        await Category.findByIdAndUpdate(id, { name, slug: slugify(name) });
        const categories = await Category.find({}).sort({ createdAt: -1 });
        
        await db.disconnectDb();
        return res.json({
          message: "Category has been updated successfuly",
          categories,
        });
      }

      case "DELETE": {
        const { id } = req.body;
        // Заменили устаревший findByIdAndRemove на findByIdAndDelete
        await Category.findByIdAndDelete(id);
        const categories = await Category.find({}).sort({ updatedAt: -1 });
        
        await db.disconnectDb();
        return res.json({
          message: "Category has been deleted successfuly",
          categories,
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
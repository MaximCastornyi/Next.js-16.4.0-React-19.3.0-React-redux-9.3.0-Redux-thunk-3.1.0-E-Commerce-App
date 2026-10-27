import db from "../../../utils/db";
import Category from "../../../models/Category";
import SubCategory from "../../../models/SubCategory";
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
    // GET-запросы могут быть публичными или также требовать проверку — 
    // оставляем общую проверку middleware для всех методов или выносим по необходимости.
    // Если GET должен быть публичным, можно вынести runMiddleware внутрь POST/PUT/DELETE.
    await runMiddleware(req, res, auth);
    await runMiddleware(req, res, admin);

    await db.connectDb();

    switch (req.method) {
      case "GET": {
        const { category } = req.query;
        console.log(category);
        if (!category) {
          await db.disconnectDb();
          return res.json([]);
        }
        const results = await SubCategory.find({ parent: category }).select("name");
        console.log(results);
        await db.disconnectDb();
        return res.json(results);
      }

      case "POST": {
        const { name, parent } = req.body;
        const test = await SubCategory.findOne({ name });
        if (test) {
          await db.disconnectDb();
          return res.status(400).json({ 
            message: "SubCategory already exist, Try a different name" 
          });
        }

        await new SubCategory({ name, parent, slug: slugify(name) }).save();
        const subCategories = await SubCategory.find({}).sort({ updatedAt: -1 });

        await db.disconnectDb();
        return res.json({
          message: `SubCategory ${name} has been created successfully.`,
          subCategories,
        });
      }

      case "PUT": {
        const { id, name, parent } = req.body;
        await SubCategory.findByIdAndUpdate(id, {
          name,
          parent,
          slug: slugify(name),
        });
        const subCategories = await SubCategory.find({}).sort({ createdAt: -1 });

        await db.disconnectDb();
        return res.json({
          message: "SubCategory has been updated successfuly",
          subCategories,
        });
      }

      case "DELETE": {
        const { id } = req.body;
        // Заменили устаревший findByIdAndRemove на findByIdAndDelete
        await SubCategory.findByIdAndDelete(id);
        const subCategories = await SubCategory.find({}).sort({ updatedAt: -1 });

        await db.disconnectDb();
        return res.json({
          message: "SubCategory has been deleted successfuly",
          subCategories,
        });
      }

      default:
        await db.disconnectDb();
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    await db.disconnectDb();
    return res.status(500).json({ message: error.message });
  }
}
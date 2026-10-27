import nc from "next-connect";
import fs from "fs";
import path from "path";
import fileUpload from "express-fileupload";
import { imgMiddleware } from "../../../middleware/imgMiddleware";

const handler = nc()
  .use(
    fileUpload({
      useTempFiles: true,
    })
  )
  .use(imgMiddleware);

export const config = {
  api: {
    bodyParser: false,
  },
};

handler.post(async (req, res) => {
  try {
    let files = Object.values(req.files).flat();
    let images = [];

    // Путь к папке public/images/products_pics
    const uploadDir = path.join(process.cwd(), "public", "images", "products_pics");

    // Создаем директорию, если её нет
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    for (const file of files) {
      // Генерируем случайное 9-значное число
      const randomName = Math.floor(100000000 + Math.random() * 900000000);
      const fileName = `${randomName}.jpg`;
      const targetPath = path.join(uploadDir, fileName);

      // Копируем файл из временной папки в public/images/products_pics
      fs.copyFileSync(file.tempFilePath, targetPath);

      // Удаляем временный файл
      removeTmp(file.tempFilePath);

      // Формируем требуемый URL вида "/images/products_pics/7342979.jpg"
      const localUrl = `/images/products_pics/${fileName}`;

      images.push({
        url: localUrl,
        public_url: String(randomName),
      });
    }

    res.json(images);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

handler.delete(async (req, res) => {
  try {
    let image_id = req.body.public_id;
    const filePath = path.join(process.cwd(), "public", "images", "products_pics", `${image_id}.jpg`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
});

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) console.log(err);
  });
};

export default handler;
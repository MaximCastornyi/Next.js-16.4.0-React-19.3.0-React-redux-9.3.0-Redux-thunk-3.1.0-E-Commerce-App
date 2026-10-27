import { getToken } from "next-auth/jwt";
import User from "../models/User";
import db from "../utils/db";

export default async function adminMiddleware(req, res, next) {
  try {
    const token = await getToken({
      req,
      secret: process.env.JWT_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
    });

    // Если токена нет вообще — пользователь не вошел в систему
    if (!token) {
      return res.status(401).json({ message: "Access denied, please sign in." });
    }

    await db.connectDb();
    let user = await User.findById(token.sub);
    await db.disconnectDb();

    // Проверяем пользователя и его роль
    if (user && user.role === "admin") {
      if (typeof next === "function") {
        return next(); // Передаем управление дальше, если это мидлвар для next-connect
      }
    } else {
      return res.status(403).json({ message: "Access denied, Admin resources." });
    }
  } catch (error) {
    await db.disconnectDb();
    return res.status(500).json({ message: error.message });
  }
}